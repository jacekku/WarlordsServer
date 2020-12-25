const WebSocket = require('ws');
const port = process.env.PORT || 8080
const wss = new WebSocket.Server({ port });

let PLAYERS = []

console.log('working on port ' + port)
wss.on('connection', function connection(ws, req) {

  ws.onmessage = (message) => {
    const messageJson = JSON.parse(message.data)
    const result = handleMessage(messageJson, ws)
    if (!result) { ws.send("ERROR"); return }
    if (result == "CONNECTED") ws.send("CONNECTED")
    wss.clients.forEach(ws => ws.send(getPositionsString()))
  }
  ws.onclose = (event) => {
    const disconnectedPlayer = event.target.player
    PLAYERS = PLAYERS.filter(player => player.name != disconnectedPlayer)
    wss.clients.forEach(ws => ws.send(getPositionsString()))

  }
});

function handleMessage(messageJson, ws) {
  if (!messageJson || !messageJson.type) {
    return
  }

  if (messageJson.type == 'connect') {
    const playerIndex = findPlayer(PLAYERS, messageJson.name)
    if (playerIndex == -1) {
      PLAYERS.push({ name: messageJson.name, position: messageJson.position })
    }
    ws.player = messageJson.name
    return "CONNECTED"
  }
  if (messageJson.type == 'move') {
    const playerIndex = findPlayer(PLAYERS, messageJson.name)
    PLAYERS[playerIndex].position = messageJson.position
    return "MOVED"
  }
}

function findPlayer(array, name) {
  return array.findIndex(item => item.name == name)
}

function getPositionsString() {
  return JSON.stringify(PLAYERS)
}


