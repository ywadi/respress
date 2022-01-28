const yargs = require('yargs/yargs');
let stringArgv = require('string-argv').parseArgsStringToArgv;
let debug = require('debug')('RESP-SERVER');

class RESP_ARGS_PARSER {
    constructor() {
        this.cmdCallbacks={};
        this.yargs = yargs();
        this.commandList = [];
        debug("Created the RESP Argument Parser.")
    }
    
    addCommand(commandString,cb){
        let split = stringArgv(commandString)
        split[0] = split[0].toLowerCase();
        this.cmdCallbacks[split[0]]=cb;
        this.yargs.command(split.join(" "));
        this.commandList.push(split.join(" "));
        debug(`Command ${commandString} added to RESP Arg Parser.`)
    }
    
    parse(reqCommand){
        reqCommand[0]= reqCommand[0].toLowerCase();
        let result = this.yargs.parse(reqCommand);
        debug(`Parsing ${reqCommand} generated ${result}`)
        return result;
    }


}
module.exports = new RESP_ARGS_PARSER();