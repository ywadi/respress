let { Buffer } = require('buffer');

/**
 * Encodes a message to the RESP protocol 
 * @param {String | Array | Object | Number | Function} request 
 * @param {Boolean} encodeArray 
 * @returns RESP encoded value 
 */
function encode(request, encodeArray = true) {
    if (request === null) {
        return '$-1\r\n'
    }
    if (Array.isArray(request) && encodeArray) {
        const content = [`*${request.length}\r\n`]
        for (let i = 0, length = request.length; i < length; i++) {
            content.push(encode(request[i], false))
        }
        return content.join('')
    }
    if (request instanceof Error) {

        return `-ERROR ${request.message}\r\n`
    }
    let value
    if (typeof request === 'object') {
        value = JSON.stringify(request);
        return encode(value);
    }
    else if (typeof request === 'function') {
        value = {}.toString.call(request)
    } else {
        value = String(request)
    }
    return `$${value.length}\r\n${value}\r\n`
}

/**
 * Decodes the message of from RESP protocol to its proper type 
 * @param {*} content The content to be decoded 
 * @param {*} startIndex Where to start the decoding 
 * @returns {String | Array | Object | Number | Function}
 */
function decodeProgressive(content, startIndex) {
    let currentIndex = startIndex
    const type = content.toString('utf8', currentIndex, currentIndex + 1)
    // +1 because type takes 1 character
    currentIndex++

    if (type === '*') {
        // Array
        const lengthEnd = content.indexOf('\r\n', currentIndex)
        const length = parseInt(content.toString('utf8', currentIndex, lengthEnd), 10)
        // +2 because of \r\n after length ends
        currentIndex = lengthEnd + 2

        const value = []
        for (let i = 0; i < length; i++) {
            const entry = decodeProgressive(content, currentIndex)
            currentIndex = entry.index
            value.push(entry.value)
        }
        return { index: currentIndex, value }
    }

    if (type === '$') {
        // String or Null
        const lengthEnd = content.indexOf('\r\n', currentIndex)
        const length = parseInt(content.toString('utf8', currentIndex, lengthEnd), 10)
        // +2 because of \r\n after length ends
        currentIndex = lengthEnd + 2

        let value
        if (length === -1) {
            // Null
            value = null
        } else {
            // String
            value = content.toString('utf8', currentIndex, currentIndex + length)
            // +2 because of \r\n at the end of string
            currentIndex += length + 2
        }

        return { index: currentIndex, value }
    }

    if (type === '+') {
        // Simple string
        const valueEnd = content.indexOf('\r\n', currentIndex)
        const value = content.toString('utf8', currentIndex, valueEnd)
        // +2 because of \r\n at the end of simple string
        currentIndex = valueEnd + 2

        return { index: currentIndex, value }
    }

    if (type === ':') {
        // Integer
        const valueEnd = content.indexOf('\r\n', currentIndex)
        const value = parseInt(content.toString('utf8', currentIndex, valueEnd), 10)
        // +2 because of \r\n at the end of simple string
        currentIndex = valueEnd + 2

        return { index: currentIndex, value }
    }

    if (type === '-') {
        // Error
        const valueEnd = content.indexOf('\r\n', currentIndex)
        const value = content.toString('utf8', currentIndex, valueEnd)
        throw new Error(value)
    }

    throw new Error('Malformed Input')
}

/**
 * The decoding function to decode RESP
 * @param {String} givenContent 
 * @returns {String | Array | Object | Number | Function}
 */
function decode(givenContent) {
    let index = 0
    const value = []
    const content = Buffer.from(givenContent)

    for (; ;) {
        const entry = decodeProgressive(content, index)
        index = entry.index
        value.push(entry.value)
        if (index === content.length) {
            // We have read it all!
            break
        }
    }

    return value[0]
}

module.exports.encode = encode;
module.exports.decodeProgressive = decodeProgressive;
module.exports.decode = decode;