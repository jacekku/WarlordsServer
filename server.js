const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    wss.clients.forEach(ws => {
        ws.send(message)
    })
  });
  
});

console.log('working')