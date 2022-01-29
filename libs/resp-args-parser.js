const yargs = require('yargs/yargs');
let stringArgv = require('string-argv').parseArgsStringToArgv;
let debug = require('debug')('RESP-SERVER');

/**
 * Used to parse the arguments in commands and also register commands.
 * @private
 */
class RESP_ARGS_PARSER {
    /**
     * Create and instance of RESP_ARGS_PARSER
     */
    constructor() {
        this.cmdCallbacks={};
        this.yargs = yargs();
        this.commandList = [];
        debug("Created the RESP Argument Parser.")
    }
    
    /**
     * Adds a command that will be used by the server to execute 
     * @param {String} commandString The command definition 
     * @param {function} cb The callback used for the command when executed 
     */
    addCommand(commandString,cb){
        let split = stringArgv(commandString)
        split[0] = split[0].toLowerCase();
        this.cmdCallbacks[split[0]]=cb;
        this.yargs.command(split.join(" "));
        this.commandList.push(split.join(" "));
        debug(`Command ${commandString} added to RESP Arg Parser.`)
    }
    
    /**
     * Parses the command sent by the client based on the added command. The parse tags each positional argument.
     * @param {String} reqCommand The command to be parsed for the client.
     * @returns Parsed command that can be used eventually making its way to the req argument.
     */
    parse(reqCommand){
        reqCommand[0]= reqCommand[0].toLowerCase();
        let result = this.yargs.parse(reqCommand);
        debug(`Parsing ${reqCommand} generated ${result}`)
        return result;
    }


}
module.exports = new RESP_ARGS_PARSER();