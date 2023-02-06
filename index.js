const http = require('node:http');
const express = require('express')
const app = express()

const WebSocket = require('ws');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const server = require('http').createServer(app,{
  autoAcceptConnections: false
});
const wss = new WebSocket.Server({ server:server });



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://notif_js:Lovely125@cluster0.aqwcd6m.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

wss.on('connection', function connection(ws) {
    console.log('A new client Connected!');
    ws.send(JSON.stringify({type:'callback notif',value:"pesan dari server"}));
  
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      console.log(JSON.parse(message) );
      client.connect(err => {
        if (err) {
            return console.log('connection errors');
        }
        console.log('connection mogodb');
    
      const table = client.db("db_one").collection("notif");
        table.insertOne(JSON.parse(message),(pErr,pRult)=>{
            if (pErr) {
                return console.log(pErr);
            }
            console.log('berhasil');
            
        })
      // perform actions on the collection object
    });
    
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
      
      ws.on('close', function close() {
        console.log('disconnected');
      });
      
    });
  });


app.get('/', (req, res) =>{
    res.statusCode = 200;
    res.sendFile(__dirname + '/app/index.html');
  })

server.listen(PORT, () => {
  console.log(`Server running at PORT:${PORT}`);
});