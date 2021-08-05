import {
    Server
} from "ws"
import {
    CustomWebsocket
} from "./model/CustomWebsocket"
import {
    PlayerHandler
} from "./PlayerHandler"
import {
    TerrainWrapper
} from "./TerrainHandler"
import {
    Utilities
} from "./Utilities"
import {
    UPlayer
} from "./model/Types";


export class WebsocketsService {

    PlayerHandlerInstance: PlayerHandler = PlayerHandler.getInstance();
    TerrainWrapperInstance: TerrainWrapper = TerrainWrapper.getInstance();

    async onmessage(msg: string, ws: CustomWebsocket, wss: Server) {
        const message = JSON.parse(msg)
        let currentPlayer: UPlayer
        if (message.type == "CONNECT") {
            await this.PlayerHandlerInstance.playerConnected(message.player)
            ws.player = this.PlayerHandlerInstance.getPlayer(message.player)
            ws.send("CONNECTED")
        }
        if (message.type == "MOVE") {
            const x = Utilities.clampNumber(message.move.x, 0, this.TerrainWrapperInstance.handler.width)
            const y = Utilities.clampNumber(message.move.y, 0, this.TerrainWrapperInstance.handler.height)
            currentPlayer = this.PlayerHandlerInstance.movePlayer(ws.player, x, y)
            ws.player = currentPlayer
        }
        const newChunks = this.TerrainWrapperInstance.handler.getChunkNeighbourhood(ws.player.x, ws.player.y)
        if (ws.playerChunk != newChunks.playerChunk) {
            ws.send(JSON.stringify({
                type: "TERRAIN",
                data: newChunks
            }))
            ws.player.playerChunk = newChunks.playerChunk
        }
        wss.clients.forEach(ws => {
            ws.send(JSON.stringify({
                type: "PLAYERS",
                data: this.PlayerHandlerInstance.players
            }))
        })
    }

    onclose(msg: string, ws: CustomWebsocket, wss: Server) {
        console.log('connection closed', ws.player)
        this.PlayerHandlerInstance.playerDisconnected(ws.player)
        wss.clients.forEach(ws => {
            ws.send(JSON.stringify({
                type: "PLAYERS",
                data: this.PlayerHandlerInstance.players
            }))
        })
    }
}