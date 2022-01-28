const { nanoid } = require("nanoid");
const net = require('net');
let { encode, decode } = require("../libs/resp-parser");
const { EventEmitter } = require("events");
let debug = require('debug')('RESP-SERVER');

class RESP_Server {
    constructor() {
        this.server = net.createServer();
        this.clients = {};
        this.requiresAuth = false;
        this.cmds = require("../libs/resp-args-parser");
        this.events = new EventEmitter();
        this.middlewareFuncs = []; //TODO, needed ?
        debug("Created RESP Server Instance")
    }

    listen(settings, cb) {
        let _server = this.server;
        _server.listen(settings.port, function () {
            cb(_server);
            debug(`Server up and running at ${Object.entries(_server.address())}`)
        });
        this.server.on('connection', this.handleConnection.bind(this));
    }

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

    onConClose(client) {
        debug(`Connection closed for ${Object.entries(client.con.address())}`)
        delete this.clients[client.con.id];
        this.events.emit("clientClose", client);
    }

    onConError(err, client) {
        debug(`Connection errored out for ${Object.entries(client.con.address())}`)
        delete this.clients[client.con.id];
        console.error(err);
        this.events.emit("clientError", client);
    }

    auth(cb) {
        this.requiresAuth = true;
        this.cmds.addCommand("AUTH [username] <password>", cb);
    }

    cmd(commandString, cb) {
        debug(`Adding command ${commandString}`)
        this.cmds.addCommand(commandString, cb);
    }

    execCmd(cmd, client) {
        debug(`Executing ${cmd} for ${Object.entries(client.con.address())}.`)
        let req = {};
        req.params = this.cmds.parse(cmd);
        delete req.params.$0
        req.client = client.id;
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

    on() {
        return this.events;
    }

}

class RESP_SERVER_CLIENT {
    constructor(con, respServer) {
        this.con = con;
        this.id = con.id;
        this.respServer = respServer;
        this.con.resp = {}
        this.requiresAuth = this.respServer.requiresAuth;
        this.con.once('close', this.onConClose.bind(this));
        this.con.on('error', this.onConError.bind(this));
        this.con.on('data', this.dataHandler.bind(this));
        debug(`New client has been created with id ${this.id} and origin ${Object.entries(this.con.address())}`)
    }

    onConClose() {
        this.respServer.onConClose(this);
    }

    onConError(err) {
        console.error(err);
        this.respServer.onConError(err, this);
        return new Error(err)
    }

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

}

module.exports = RESP_Server;