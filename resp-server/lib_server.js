const { nanoid } = require("nanoid");
const net = require('net');
let { encode, decode } = require("../libs/resp-parser");
const { EventEmitter } = require("events");
let debug = require('debug')('RESP-SERVER');

/** The Server class which the instance creates the server. */
class RESP_Server {
    /**
     * Create server instance.
     */
    constructor() {
        this.server = net.createServer();
        this.clients = {};
        this.requiresAuth = false;
        this.cmds = require("../libs/resp-args-parser");
        this.events = new EventEmitter();
        this.middlewareFuncs = []; //TODO, needed ?
        debug("Created RESP Server Instance")
    }

    /**
     * Create a server and start it.
     * @param {object} settings currently has only port option {port:9001}
     * @param {function} cb a function callback when the server is started
     */
    listen(settings, cb) {
        let _server = this.server;
        _server.listen(settings.port, function () {
            cb(_server);
            debug(`Server up and running at ${Object.entries(_server.address())}`)
        });
        this.server.on('connection', this.handleConnection.bind(this));
    }

    /**
     * Handles the new connections to the RESP server, uses TCP 
     * @param {Socket} con is the tcp.socket 
     */
    handleConnection(con) {
        debug(`Handeling connection ${con.address}`)
        con.id = nanoid();
        let client = new RESP_SERVER_CLIENT(con, this);
        this.clients[con.id] = client;
        let remoteAddress = con.remoteAddress + ':' + con.remotePort;

        con.send = function (respMsg) {
            debug(`Sending message ${respMsg} to ${Object.entries(con.address())}`)
            con.write(encode(respMsg))
        }
        con.auth = function (verdict) {
            con.isAuthenticated = verdict;
            if (verdict) {
                con.send(true);
            }
            else {
                this.isAuthenticated = false;
                con.send(new Error("Wrong Authentication."));
                con.destroy();
            }
            debug(`Authentication for ${Object.entries(con.address())} resulted in access ${verdict}.`)
        }

        this.events.emit("clientConnect", client);
    }

    /**
     * A function called by the client on the server instance when a client closes 
     * @param {RESP_SERVER_CLIENT} client is the instance of RESP_SERVER_CLIENT. 
     */
    onConClose(client) {
        debug(`Connection closed for ${Object.entries(client.con.address())}`)
        delete this.clients[client.con.id];
        this.events.emit("clientClose", client);
    }

    /**
     * A function called by the client on the server instance when a client errors out.
     * @param {Error} err The error that has caused the connection drop
     * @param {RESP_SERVER_CLIENT} client The RESP_SERVER_CLIENT client instance 
     */
    onConError(err, client) {
        debug(`Connection errored out for ${Object.entries(client.con.address())}`)
        delete this.clients[client.con.id];
        console.error(err);
        this.events.emit("clientError", client);
    }

    /**
     * Used to register an authentication command for the RESP protocol. Once called it will expect authentication. 
     * @param {function} cb The callback that will be called for authentication, cb will have req and res arguments passed. 
     */
    auth(cb) {
        this.requiresAuth = true;
        this.cmds.addCommand("AUTH [username] <password>", cb);
    }

    /**
     * Register a command to be used. This will allow to register the command and positional arguments 
     * ex: PING <message>
     * @param {String} commandString a command string with positional arguments
     * @param {function} cb The callback function for when command is triggered, cb is passed a req and res.
     */
    cmd(commandString, cb) {
        debug(`Adding command ${commandString}`)
        this.cmds.addCommand(commandString, cb);
    }

    /**
     * Executes the command recieved by parsing it, looking the cb function and executing the cb
     * @param {String} cmd The command string 
     * @param {RESP_SERVER_CLIENT} client the RESP_SERVER_CLIENT instance 
     */
    execCmd(cmd, client) {
        debug(`Executing ${cmd} for ${Object.entries(client.con.address())}.`)
        let req = {};
        req.params = this.cmds.parse(cmd);
        delete req.params.$0
        /**
         * req.client has the client.id as well as 3 helper functions 
         * setClientVar: allows developer to add a variable to the client connected 
         * getClientVar: allows developer to retrive stored variable on client
         * delClientVar: allows developer to delete the stored variable 
         */
        req.client = {
            id: client.id,
            setClientVar: client.setClientVar.bind(client),
            getClientVar: client.getClientVar.bind(client),
            delClientVar: client.delClientVar.bind(client)
        };
        let res = { send: client.con.send, auth: client.con.auth };

        if (this.cmds.cmdCallbacks.hasOwnProperty(req.params._[0])) {
            debug(`Executing ${cmd} for ${Object.entries(client.con.address())}.`)
            this.cmds.cmdCallbacks[req.params._[0]](req, res);
        }
        else if (this.cmds.cmdCallbacks.hasOwnProperty("*") || this.cmds.cmdCallbacks.hasOwnProperty("$0")) {
            debug(`Executing ${cmd} on * for ${Object.entries(client.con.address())}.`)
            let star;
            this.cmds.cmdCallbacks.hasOwnProperty("*") ? star = "*" : star = "$0";
            this.cmds.cmdCallbacks[star](req, res);
        }
        else {
            debug(`Incorrect command request ${cmd} by ${Object.entries(client.con.address())}.`)
            res.send(new Error("Incorrect command..."));
        }

    }

    /**
     * Used to return the server event object for the purpose of listening to the events emitted.
     * @returns Event to be able to listen to the events, events can be clientConnect, clientClose, clientError
     */
    on() {
        return this.events;
    }

}

/**
 * The client definition, each connected client will have an instance.
 * 
 */
class RESP_SERVER_CLIENT {
    /**
     * @param {Socket} con The client's Socket 
     * @param {RESP_Server} respServer the Server that created the client 
     */
    constructor(con, respServer) {
        this.con = con;
        this.id = con.id;
        this.respServer = respServer;
        this.con.resp = {}
        this.requiresAuth = this.respServer.requiresAuth;
        this.con.once('close', this.onConClose.bind(this));
        this.con.on('error', this.onConError.bind(this));
        this.con.on('data', this.dataHandler.bind(this));
        this.clientVars = {};
        debug(`New client has been created with id ${this.id} and origin ${Object.entries(this.con.address())}`)
    }

    /**
     * 
     * Handles when the client socket is closed 
     */
    onConClose() {
        this.respServer.onConClose(this);
    }

    /**
     * Handles when the client socket errors out
     * @param {Error} err 
     * @returns the error
     */
    onConError(err) {
        console.error(err);
        this.respServer.onConError(err, this);
        return err
    }

    /**
     * Handles when the client recieves a buffer. 
     * @param {Buffer} buffer The buffer sent to the Socket.
     */
    async dataHandler(buffer) {
        let msg = decode(buffer);
        debug(`Handling message ${msg} request for ${Object.entries(this.con.address())}.`)
        if (msg[0].toLowerCase() == "auth") {
            debug(`Executing authentication command for ${Object.entries(this.con.address())}.`)
            this.respServer.execCmd(msg, this)
        }
        else if ((this.con.isAuthenticated && this.requiresAuth) || !this.requiresAuth) {
            this.respServer.execCmd(msg, this)
        } else {
            debug(`Authentication failed for ${Object.entries(this.con.address())}.`)
            this.con.send(new Error("Authentication is required.."));
            this.con.end();
            this.con.destroy();
        }
    }

    /**
     * Allows the developer to get a client variable previously set 
     * @param {String} variableName The name of the variable  
     * @returns {Any} variable that has been stored 
     */
    getClientVar(variableName) { return this.clientVars[variableName] }
    /**
     * Allows developer to set a variable for a client that can be used later 
     * @param {String} variableName The name of the variable 
     * @param {Any} variableValue The value of the variable 
     */
    setClientVar(variableName, variableValue) { this.clientVars[variableName] = variableValue; }

    /**
     * Delete a previosuly stored client variable 
     * @param {String} variableName The name of the variable to be deleted 
     */
    delClientVar(variableName) {
        try {
            delete this.clientVars[variableName]
        } catch (error) {
            debug(error)
        }
    }
}

module.exports = RESP_Server;