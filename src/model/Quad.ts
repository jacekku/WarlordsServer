export class Quad {
    x: number
    y: number
    width: number
    height: number
    constructor(x: number,y: number,width: number,height: number) {
        this.x = x
        this.y = y 
        this.width = width
        this.height = height
    }

    static pointInQuad(quad: Quad,pointX: number,pointY: number) {
        let {x,y,width,height} = quad
        x = Number(x)
        y = Number(y)
        width = Number(width)
        height = Number(height)
        return pointX >= x && pointY >= y && pointX < x + width && pointY < y + height
    }
}
