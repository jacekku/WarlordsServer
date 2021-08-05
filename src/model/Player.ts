export class Player {
    name: string
    x: number
    y: number
    playerChunk: any
    active: boolean
    constructor(name: string, x: number, y: number) {
        this.name = name
        this.x = x
        this.y = y
    }
}