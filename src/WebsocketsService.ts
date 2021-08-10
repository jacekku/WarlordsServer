import {
    Server
} from "ws"
import {
    CustomWebsocket
} from "./model/CustomWebsocket"
import {
    PlayerService
} from "./PlayerService"
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
    playerHandler: PlayerService
    terrainWrapper: TerrainWrapper

    constructor(playerHandler: PlayerService, terrainWrapper: TerrainWrapper) {
        this.playerHandler = playerHandler;
        this.terrainWrapper = terrainWrapper;
    }

    async onmessage(msg: string, ws: CustomWebsocket, wss: Server) {
        const message = JSON.parse(msg)
        let currentPlayer: UPlayer
        if (message.type == "CONNECT") {
            await this.playerHandler.playerConnected(message.player)
            ws.player = this.playerHandler.getPlayer(message.player)
            ws.send("CONNECTED")
        }
        if (message.type == "MOVE") {
            const x = Utilities.clampNumber(message.move.x, 0, this.terrainWrapper.terrain.width)
            const y = Utilities.clampNumber(message.move.y, 0, this.terrainWrapper.terrain.height)
            currentPlayer = this.playerHandler.movePlayer(ws.player, x, y)
            ws.player = currentPlayer
        }
        if (message.type == "CONNECT_DASHBOARD") {
            console.log("dashboard connected")
        }
        if (ws.player) {
            const newChunks = this.terrainWrapper.terrain.getChunkNeighbourhood(ws.player.x, ws.player.y)
            if (ws.playerChunk != newChunks.playerChunk) {
                ws.send(JSON.stringify({
                    type: "TERRAIN",
                    data: newChunks
                }))
                ws.player.playerChunk = newChunks.playerChunk
            }
        }
        //todo only send visible players - all for dashboard
        wss.clients.forEach(ws => {
            ws.send(JSON.stringify({
                type: "PLAYERS",
                data: this.playerHandler.players
            }))
        })
    }

    onclose(msg: string, ws: CustomWebsocket, wss: Server) {
        console.log('connection closed', ws.player)
        if(!ws.player) return
        this.playerHandler.playerDisconnected(ws.player)
        wss.clients.forEach(ws => {
            ws.send(JSON.stringify({
                type: "PLAYERS",
                data: this.playerHandler.players
            }))
        })
    }
}