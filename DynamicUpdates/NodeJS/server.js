//////
//
//  This is sample code to bridge VB DB and WebApps via websockets.
//
//////

// Read Environment Parameters from Oracle Application Container Cloud Service (ACCS)
// If no env variables are there, use default values.
var port = Number(process.env.PORT || 7789);

//
// Setup express
//
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var util = require('util')
var https = require('https')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/notify', function (req, res) {
  console.log("Message received");
  var payload = req.body;
  var numClients = clientConnection.length;
  var newClientConnection = clientConnection.slice(0);
  for(var i=0;i<numClients;i++) {
    console.log("Sending to client "+i);
    try {
      clientConnection[i].send(JSON.stringify(payload));
    } catch (ex) {
      console.log("error sending.  Removing client: "+ex);
      newClientConnection.splice(i,1);
    }
  }
  clientConnection=newClientConnection.slice(0);
  res.end("Success");
});

var server = app.listen(port, function () {
  console.log("App listening at http://:"+port);
});


var WebSocketServer = require('ws').Server 
var clientConnection = new Array();

// Create an instance of websocket server.
var wss = new WebSocketServer({server: server});
console.log('New server created, waiting for connections...');

// Add the connection listener that will be triggered once the connection is established.
wss.on('connection', function(ws) {
  console.log('Server was connected.');
  clientConnection.push(ws);
    //  Add the listener for that particular websocket connection instance.
    ws.on('message', function(message) {
        console.log('Server received message: %s', message);
        // Send back the message that we receive from the browser
        ws.send(message);
    });  
});


