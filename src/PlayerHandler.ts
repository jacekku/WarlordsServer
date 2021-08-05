import { Player } from "./model/Player"
import { UPlayer } from "./model/Types";

const firebaseService = require('./firebaseService')

export class PlayerHandler {
    players: Player[]
    private static instance: PlayerHandler;

    constructor() {
        this.players = []
    }

    public static getInstance(): PlayerHandler {
        if (!PlayerHandler.instance) {
            PlayerHandler.instance = new PlayerHandler();
        }

        return PlayerHandler.instance;
    }

    async registerPlayer(player: Player) {
        const newPlayer = new Player(player.name, 10, 10)
        this.players.push(newPlayer)
        await firebaseService.savePlayer(newPlayer)
    }

    async getPlayerFromDB(player: Player) {
        return await firebaseService.getPlayer(player.name)
    }

    getPlayer(player: Player): Player | undefined {
        return this.players.find(pl => pl.name == player.name)
    }

    async playerConnected(player: Player) {
        const connectedPlayer = await this.getPlayerFromDB(player)
        if (connectedPlayer) {
            this.players.push(connectedPlayer.data())
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
        firebaseService.savePlayer(disconnectedPlayer)
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
