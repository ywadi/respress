<a name="RESP_Server"></a>

## RESP\_Server
The Server class which the instance creates the server.

**Kind**: global class  

* [RESP_Server](#RESP_Server)
    * [new RESP_Server()](#new_RESP_Server_new)
    * [.listen(settings, cb)](#RESP_Server+listen)
    * [.auth(cb)](#RESP_Server+auth)
    * [.cmd(commandString, cb)](#RESP_Server+cmd)
    * [.on()](#RESP_Server+on) ⇒

<a name="new_RESP_Server_new"></a>

### new RESP\_Server()
Create server instance.

<a name="RESP_Server+listen"></a>

### resP_Server.listen(settings, cb)
Create a server and start it.

**Kind**: instance method of [<code>RESP\_Server</code>](#RESP_Server)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>object</code> | currently has only port option {port:9001} |
| cb | <code>function</code> | a function callback when the server is started |

<a name="RESP_Server+auth"></a>

### resP_Server.auth(cb)
Used to register an authentication command for the RESP protocol. Once called it will expect authentication.

**Kind**: instance method of [<code>RESP\_Server</code>](#RESP_Server)  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | The callback that will be called for authentication, cb will have req and res arguments passed. |

<a name="RESP_Server+cmd"></a>

### resP_Server.cmd(commandString, cb)
Register a command to be used. This will allow to register the command and positional arguments 
ex: PING <message>

**Kind**: instance method of [<code>RESP\_Server</code>](#RESP_Server)  

| Param | Type | Description |
| --- | --- | --- |
| commandString | <code>String</code> | a command string with positional arguments |
| cb | <code>function</code> | The callback function for when command is triggered, cb is passed a req and res. |

<a name="RESP_Server+on"></a>

### resP_Server.on() ⇒
Used to return the server event object for the purpose of listening to the events emitted.

**Kind**: instance method of [<code>RESP\_Server</code>](#RESP_Server)  
**Returns**: Event to be able to listen to the events, events can be clientConnect, clientClose, clientError  
