## Functions

<dl>
<dt><a href="#encode">encode(request, encodeArray)</a> ⇒</dt>
<dd><p>Encodes a message to the RESP protocol</p>
</dd>
<dt><a href="#decodeProgressive">decodeProgressive(content, startIndex)</a> ⇒ <code>String</code> | <code>Array</code> | <code>Object</code> | <code>Number</code> | <code>function</code></dt>
<dd><p>Decodes the message of from RESP protocol to its proper type</p>
</dd>
<dt><a href="#decode">decode(givenContent)</a> ⇒ <code>String</code> | <code>Array</code> | <code>Object</code> | <code>Number</code> | <code>function</code></dt>
<dd><p>The decoding function to decode RESP</p>
</dd>
</dl>

<a name="encode"></a>

## encode(request, encodeArray) ⇒
Encodes a message to the RESP protocol

**Kind**: global function  
**Returns**: RESP encoded value  

| Param | Type | Default |
| --- | --- | --- |
| request | <code>String</code> \| <code>Array</code> \| <code>Object</code> \| <code>Number</code> \| <code>function</code> |  | 
| encodeArray | <code>Boolean</code> | <code>true</code> | 

<a name="decodeProgressive"></a>

## decodeProgressive(content, startIndex) ⇒ <code>String</code> \| <code>Array</code> \| <code>Object</code> \| <code>Number</code> \| <code>function</code>
Decodes the message of from RESP protocol to its proper type

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>\*</code> | The content to be decoded |
| startIndex | <code>\*</code> | Where to start the decoding |

<a name="decode"></a>

## decode(givenContent) ⇒ <code>String</code> \| <code>Array</code> \| <code>Object</code> \| <code>Number</code> \| <code>function</code>
The decoding function to decode RESP

**Kind**: global function  

| Param | Type |
| --- | --- |
| givenContent | <code>String</code> | 

