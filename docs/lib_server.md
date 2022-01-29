## Classes

<dl>
<dt><a href="#RESP_Server">RESP_Server</a></dt>
<dd><p>The Server class which the instance creates the server.</p>
</dd>
<dt><a href="#RESP_SERVER_CLIENT">RESP_SERVER_CLIENT</a></dt>
<dd><p>The client definition, each connected client will have an instance.</p>
</dd>
</dl>

<a name="RESP_Server"></a>

## RESP\_Server
The Server class which the instance creates the server.

**Kind**: global class  

* [RESP_Server](#RESP_Server)
    * [new RESP_Server()](#new_RESP_Server_new)
    * [.listen(settings, cb)](#RESP_Server+listen)
    * [.handleConnection(con)](#RESP_Server+handleConnection)
    * [.onConClose(client)](#RESP_Server+onConClose)
    * [.onConError(err, client)](#RESP_Server+onConError)
    * [.auth(cb)](#RESP_Server+auth)
    * [.cmd(commandString, cb)](#RESP_Server+cmd)
    * [.execCmd(cmd, client)](#RESP_Server+execCmd)
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

<a name="RESP_Server+handleConnection"></a>

### resP_Server.handleConnection(con)
Handles the new connections to the RESP server, uses TCP

**Kind**: instance method of [<code>RESP\_Server</code>](#RESP_Server)  

| Param | Type | Description |
| --- | --- | --- |
| con | <code>Socket</code> | is the tcp.socket |

<a name="RESP_Server+onConClose"></a>

### resP_Server.onConClose(client)
A function called by the client on the server instance when a client closes

**Kind**: instance method of [<code>RESP\_Server</code>](#RESP_Server)  

| Param | Type | Description |
| --- | --- | --- |
| client | [<code>RESP\_SERVER\_CLIENT</code>](#RESP_SERVER_CLIENT) | is the instance of RESP_SERVER_CLIENT. |

<a name="RESP_Server+onConError"></a>

### resP_Server.onConError(err, client)
A function called by the client on the server instance when a client errors out.

**Kind**: instance method of [<code>RESP\_Server</code>](#RESP_Server)  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | The error that has caused the connection drop |
| client | [<code>RESP\_SERVER\_CLIENT</code>](#RESP_SERVER_CLIENT) | The RESP_SERVER_CLIENT client instance |

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

<a name="RESP_Server+execCmd"></a>

### resP_Server.execCmd(cmd, client)
Executes the command recieved by parsing it, looking the cb function and executing the cb

**Kind**: instance method of [<code>RESP\_Server</code>](#RESP_Server)  

| Param | Type | Description |
| --- | --- | --- |
| cmd | <code>String</code> | The command string |
| client | [<code>RESP\_SERVER\_CLIENT</code>](#RESP_SERVER_CLIENT) | the RESP_SERVER_CLIENT instance |

<a name="RESP_Server+on"></a>

### resP_Server.on() ⇒
Used to return the server event object for the purpose of listening to the events emitted.

**Kind**: instance method of [<code>RESP\_Server</code>](#RESP_Server)  
**Returns**: Event to be able to listen to the events, events can be clientConnect, clientClose, clientError  
<a name="RESP_SERVER_CLIENT"></a>

## RESP\_SERVER\_CLIENT
The client definition, each connected client will have an instance.

**Kind**: global class  

* [RESP_SERVER_CLIENT](#RESP_SERVER_CLIENT)
    * [new RESP_SERVER_CLIENT(con, respServer)](#new_RESP_SERVER_CLIENT_new)
    * [.onConClose()](#RESP_SERVER_CLIENT+onConClose)
    * [.onConError(err)](#RESP_SERVER_CLIENT+onConError) ⇒
    * [.dataHandler(buffer)](#RESP_SERVER_CLIENT+dataHandler)
    * [.getClientVar(variableName)](#RESP_SERVER_CLIENT+getClientVar) ⇒ <code>Any</code>
    * [.setClientVar(variableName, variableValue)](#RESP_SERVER_CLIENT+setClientVar)
    * [.delClientVar(variableName)](#RESP_SERVER_CLIENT+delClientVar)

<a name="new_RESP_SERVER_CLIENT_new"></a>

### new RESP\_SERVER\_CLIENT(con, respServer)

| Param | Type | Description |
| --- | --- | --- |
| con | <code>Socket</code> | The client's Socket |
| respServer | [<code>RESP\_Server</code>](#RESP_Server) | the Server that created the client |

<a name="RESP_SERVER_CLIENT+onConClose"></a>

### resP_SERVER_CLIENT.onConClose()
Handles when the client socket is closed

**Kind**: instance method of [<code>RESP\_SERVER\_CLIENT</code>](#RESP_SERVER_CLIENT)  
<a name="RESP_SERVER_CLIENT+onConError"></a>

### resP_SERVER_CLIENT.onConError(err) ⇒
Handles when the client socket errors out

**Kind**: instance method of [<code>RESP\_SERVER\_CLIENT</code>](#RESP_SERVER_CLIENT)  
**Returns**: the error  

| Param | Type |
| --- | --- |
| err | <code>Error</code> | 

<a name="RESP_SERVER_CLIENT+dataHandler"></a>

### resP_SERVER_CLIENT.dataHandler(buffer)
Handles when the client recieves a buffer.

**Kind**: instance method of [<code>RESP\_SERVER\_CLIENT</code>](#RESP_SERVER_CLIENT)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>Buffer</code> | The buffer sent to the Socket. |

<a name="RESP_SERVER_CLIENT+getClientVar"></a>

### resP_SERVER_CLIENT.getClientVar(variableName) ⇒ <code>Any</code>
Allows the developer to get a client variable previously set

**Kind**: instance method of [<code>RESP\_SERVER\_CLIENT</code>](#RESP_SERVER_CLIENT)  
**Returns**: <code>Any</code> - variable that has been stored  

| Param | Type | Description |
| --- | --- | --- |
| variableName | <code>String</code> | The name of the variable |

<a name="RESP_SERVER_CLIENT+setClientVar"></a>

### resP_SERVER_CLIENT.setClientVar(variableName, variableValue)
Allows developer to set a variable for a client that can be used later

**Kind**: instance method of [<code>RESP\_SERVER\_CLIENT</code>](#RESP_SERVER_CLIENT)  

| Param | Type | Description |
| --- | --- | --- |
| variableName | <code>String</code> | The name of the variable |
| variableValue | <code>Any</code> | The value of the variable |

<a name="RESP_SERVER_CLIENT+delClientVar"></a>

### resP_SERVER_CLIENT.delClientVar(variableName)
Delete a previosuly stored client variable

**Kind**: instance method of [<code>RESP\_SERVER\_CLIENT</code>](#RESP_SERVER_CLIENT)  

| Param | Type | Description |
| --- | --- | --- |
| variableName | <code>String</code> | The name of the variable to be deleted |

