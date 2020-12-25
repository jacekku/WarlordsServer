const WebSocket = require('ws');
const port = process.env.PORT || 8080
const wss = new WebSocket.Server({ port });

wss.on('connection', function connection(ws, req) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    wss.clients.forEach(ws => {
      ws.send(message)
    })
  });

});

console.log('working')