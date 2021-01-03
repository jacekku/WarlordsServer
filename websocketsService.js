const {
    PlayerHandler
} = require('./PlayerHandler')
const {
    terrainWrapper
} = require('./TerrainHandler')

const {clampNumber} = require('./utils')

async function onmessage(msg, ws, wss) {
    const message = JSON.parse(msg)

    if (message.type == "CONNECT") {
        await PlayerHandler.playerConnected(message.player)
        ws.player = PlayerHandler.getPlayer(message.player)
        ws.send("CONNECTED")
    }
    if (message.type == "MOVE") {
        const x = clampNumber(message.move.x, 0, terrainWrapper.handler.width)
        const y = clampNumber(message.move.y, 0, terrainWrapper.handler.height)
        player = PlayerHandler.movePlayer(ws.player, x, y)
        ws.player = player
    }
    const newChunks = terrainWrapper.handler.getChunkNeighbourhood(ws.player.x, ws.player.y)
    if(ws.playerChunk != newChunks.playerChunk || newChunks.updated) {
        ws.send(JSON.stringify({type:"TERRAIN", data:newChunks}))
        ws.player.playerChunk = newChunks.playerChunk
    }
    wss.clients.forEach(ws => {
        ws.send(JSON.stringify({type:"PLAYERS", data:PlayerHandler.players}))
    })
}

function onclose(msg, ws, wss) {
    console.log('connection closed', ws.player)
    PlayerHandler.playerDisconnected(ws.player)
    wss.clients.forEach(ws => {
        ws.send(JSON.stringify({type:"PLAYERS", data:PlayerHandler.players}))
    })
}

module.exports = {
    onmessage,
    onclose
}