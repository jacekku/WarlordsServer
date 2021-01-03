const firebaseService = require('./firebaseService')

class PlayerHandler {
    players

    constructor() {
        this.players = []
    }

    async registerPlayer(player) {
        const newPlayer = new Player(player.name, 10, 10)
        this.players.push(newPlayer)
        await firebaseService.savePlayer(newPlayer)
    }

    async getPlayerFromDB(player) {
        return await firebaseService.getPlayer(player.name)
    }

    getPlayer(player) {
        return this.players.find(pl => pl.name == player.name)
    }

    async playerConnected(player) {
        const connectedPlayer = await this.getPlayerFromDB(player)
        if (connectedPlayer) {
            this.players.push(connectedPlayer.data())
        } else {
            await this.registerPlayer(player)
        }
        const aPlayer = this.getPlayer(player)
        aPlayer.active = true
    }

    playerDisconnected(player) {
        const disconnectedPlayer = this.getPlayer(player)
        disconnectedPlayer.active = false
        this.players = this.players.filter(pl => pl.name != player.name)
        firebaseService.savePlayer(disconnectedPlayer)
    }

    movePlayer(player, x, y) {
        const pl = this.getPlayer(player)
        pl.x = x
        pl.y = y
        return pl
    }

    updatePlayer(newPlayer) {
        const player = this.getPlayer(newPlayer)
        return Object.assign(player, newPlayer)
    }

    getNeighbouringPlayers(player) {
        const playerChunk = player.playerChunk
        const neighbours = [

        ]
    }
}


class Player {
    name
    x
    y
    constructor(name, x, y) {
        this.name = name
        this.x = x
        this.y = y
    }
}


module.exports = {
    PlayerHandler: new PlayerHandler()
}