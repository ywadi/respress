let RESP_Server = require("../resp-server/_server");
let app = new RESP_Server();

app.auth((req, res) => {
    if (req.params.password == "letMeIn!") {
        res.auth(true);
    }
    else {
        //You shall not pass
        res.auth(false);
    }
})


app.cmd("COMMAND", (req, res) => {
    res.send(app.cmds.commandList)
})

app.cmd("CLIENT <subcommand>", (req, res) => {
    if (req.params.subcommand.toLowerCase() == "getname") {
        res.send(req.client);
    }
    else {
        res.send(new Error("Missing correct subcommand"));
    }
})

app.cmd("PING [message...]", (req, res) => {
    if (req.params.message) {
        res.send(req.params.message);
    }
    else {
        res.send("PONG")
    }

})

app.cmd("PingDelayed",async (req,res)=>{
    await wait();
    res.send("PONG!");
})

app.cmd("*",(req,res)=>{
    res.send("A Default execution for the command")
})

app.on("clientConnect", (client) => { console.log("NEW CLIENT YAY!", client.id) })
app.on("clientClose", (client) => { console.log("Client just left :( ", client.id) })
app.on("clientError", (client) => { console.log(client.id, " what the hell did you do?") })

app.listen({port:9001} , (server) => {}) 


async function wait() {
    return await new Promise(resolve => {
        setTimeout(() => {
            resolve('done');
        }, 3000);
    });
}