const Redis = require("ioredis");
const redis = new Redis({port:9001, password:"letMeIn!"});
redis.call('PING', ['yousef', 'wadi', 'venom'], 
function(err, value) { 
    console.log(value);
 });
