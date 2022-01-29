
# RESPRESS

![enter image description here](https://github.com/ywadi/respress/raw/5abe18a745ca2fc0e54629e84b77dae584c1eb35/assets/respress.png)

A RESP 'Redis Serialization Protocol' library implementation to generate a server, uses a similar approach to express to define you serer, making it easy and fast.

Using this library you can spin off a RESP-TCP server very fast, the server can be connected to using any redis compatible library or tool like redis-cli or [ioredis](https://www.npmjs.com/package/ioredis) .

You can find a server example in the example folder.

## Installation

Simply install the library using

  

npm install respress --save

to use it just require the library

  

### Getting Started

let RESPRESS = require("respress");

let app = new RESPRESS();

Now you are ready to spin off your server, it is very similar to express, the idea was to keep it simple for developers to implement RESP in their code.

  

let RESPRESS = require("respress");

let app = new RESPRESS();

//Register a command PING which accepts multiple arguments and is returned

//in req.params.message

app.cmd("PING [message...]", (req, res) => {

if (req.params.message) {

res.send(req.params.message);

}

else {

res.send("PONG");

}

})

//Listen to client connections through the events provided

app.on("clientConnect", (client) => { console.log("NEW CLIENT YAY!", client.id) });

  

//Start server and listen to port 9001

app.listen({port:9001} , (server) => {});

  

Yes, it is that simple. Now lets get into details.

  

### Registering Commands

As seen before to register commands its simple. There are many things you can use to register commands and will be described below.

#### A simple command with no arguments

The command "COMMAND" is registered, once it is called by the client the handler function is called returning req and res. Req can be used to capture parsed commands and arguments where as res can be used to respond to the client.

  

app.cmd("COMMAND", (req, res) => {

res.send(app.cmds.commandList)

})

#### A Command with arguments

Positional arguments can be placed when registering a command, examples below;

  

//Register a required argument called subcommand, use <> to register required

// req.params.subcommand returns a single string

app.cmd("CLIENT <subcommand>", (req, res) => {

if (req.params.subcommand.toLowerCase() == "getname") {

res.send(req.client);

}

else {

res.send(new Error("Missing correct subcommand"));

}

})

//Register multiple series of messages as optional, use [] to define its optional and

// use .... after the argument name to indicate that it can be multiple messages, this

// is returned to req.params.message as an array

app.cmd("PING [message...]", (req, res) => {

if (req.params.message) {

res.send(req.params.message);

}

else {

res.send("PONG")

}

})

//Using the * will be the default handler of commands that are not defined. req.params._

//will return an array of all the params tokenized in an array for your usage.

app.cmd("*",(req,res)=>{

res.send("A Default execution for the command")

})

  

### Authentication

  

To register an authentication handler all you need to do is use the following code below. the usage of `app.auth` method to register an authentication handler. `req.params.username` and `req.params.password` will be returned for authentication. `res.auth()` needs to be called with true or false to indicate if authentication was successful.

  

app.auth((req, res) => {

if (req.params.password == "letMeIn!") {

res.auth(true);

}

else {

//You shall not pass

res.auth(false);

}

})

  

### Sending Responses

To send responses all command handlers have a `res.send()` argument that can be used to respond to the clients command request. You can send different response types as below;

  

res.send("You can send a simple string");

res.send(["Or","send","an", "array"]);

res.send({obj:"An object can be sent and will be stringified"})

res.send(new Error("Error: can be sent and managed correctly by client");

res.sent(()=>{console.log("Sending a function, it will be sent as a string definition."})

  

### Command Argument Definitions

You can use multiple methods to register your positional arguments, below are some examples;

  

//<argument> is required and [argument] is optional

get <source> [proxy]'

//Use an alias where <username|email> will populate

//req.params with both .username and .email with the same value

get <username|email> [password]

//Variadic arguments all to have multiple messages associated to a name.

// Use ... to indicated variadic arguments.

// req.params.files will be an array with all messages assigned.

download <url> [files..]

## API
The apis can be found in the DOCs folder. Links as follows; 
- [RESP_SERVER](https://github.com/ywadi/respress/blob/main/docs/lib_server.md)  
- [RESP-PARSER](https://github.com/ywadi/respress/blob/main/docs/resp-parser.md)

# Contribution

Contributions are welcome, if you are interested please let me know and would be happy to get you on-board.