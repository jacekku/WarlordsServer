class PlayerHandler {
    players

    constructor() {
        this.players = []
    }

    registerPlayer(player) {
        this.players.push(new Player(player.name, 1, 1))
    }

    getPlayer(player) {
        return this.players.find(pl => pl.name === player.name)
    }

    movePlayer(player, x,y) {
        const pl = this.getPlayer(player) 
        pl.x = x
        pl.y = y
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
    PlayerHandler, Player
}