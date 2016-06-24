var events = require("events");
var net = require("net")

var channel = new events.EventEmitter();

channel.clients = {};
channel.subscriptions = {};

channel.on('join',function(id, client){
    console.log(id+' is joined!');
    this.clients[id] = client;
    this.subscriptions[id] = function(senderId, message){
        
        
        //    if(id != senderId){
                console.log(id +'    '+senderId+'    '+ message);
                this.clients[id].write(message);
      //      }
         
      
    }
    this.on('broadcast',this.subscriptions[id]);
});

var server = net.createServer(function(client){
    var id = client.remoteAddress+':'+client.remotePort;
    
    console.log(id+ ' is connected!');
    channel.emit('join',id,client);
    
    client.on('data',function(data){
        console.log(id+ ' sent data :'+data);
        data = data.toString();
        channel.emit('broadcast',id,data);
    });
});

server.listen(8888);