import { Player } from "./model/Player"
import { UPlayer } from "./model/Types";
import { PermanentStorage } from "./storage/PermanentStorage";
import { TerrainWrapper } from "./TerrainHandler";


export class PlayerService {
    players: Player[]
    private permanentStorage: PermanentStorage;
    private terrainWrapper: TerrainWrapper;

    constructor(permanentStorage: PermanentStorage, terrainWrapper: TerrainWrapper) {
        this.players = []
        this.permanentStorage = permanentStorage;
        this.terrainWrapper = terrainWrapper
    }

    async registerPlayer(player: Player) {
        const newPlayer = new Player(player.name, 10, 10)
        this.players.push(newPlayer)
        await this.permanentStorage.savePlayer(this.terrainWrapper.terrain.mapId, newPlayer)
    }

    async getPlayerFromDB(player: Player) {
        return await this.permanentStorage.getPlayer(this.terrainWrapper.terrain.mapId, player.name)
    }

    getPlayer(player: Player): Player | undefined {
        return this.players.find(pl => pl.name == player.name)
    }

    async playerConnected(player: Player) {
        const connectedPlayer = await this.getPlayerFromDB(player)
        if (connectedPlayer) {
            this.players.push(connectedPlayer)
        } else {
            await this.registerPlayer(player)
        }
        const aPlayer: Player | undefined = this.getPlayer(player)
        if(aPlayer === undefined) return 
        aPlayer.active = true
    }

    playerDisconnected(player: Player) {
        const disconnectedPlayer: Player | undefined = this.getPlayer(player)
        if(disconnectedPlayer === undefined) return 
        disconnectedPlayer.active = false
        this.players = this.players.filter(pl => pl.name != player.name)
        this.permanentStorage.savePlayer(this.terrainWrapper.terrain.mapId, disconnectedPlayer)
    }

    movePlayer(player: Player, x: number, y:number): UPlayer {
        const pl: Player | undefined = this.getPlayer(player)
        if(pl === undefined) return 
        pl.x = x
        pl.y = y
        return pl
    }

    updatePlayer(newPlayer: Player) {
        const player = this.getPlayer(newPlayer)
        return Object.assign(player, newPlayer)
    }

    getNeighbouringPlayers(player: Player) {
        const playerChunk = player.playerChunk
        const neighbours = [

        ]
    }
}
