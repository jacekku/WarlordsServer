const {noise} = require('./perlin')

class Quad {
    x
    y
    width
    height
    constructor(x,y,width,height) {
        this.x = x
        this.y = y 
        this.width = width
        this.height = height
    }

    pointInQuad(pointX,pointY) {
        return pointX >= this.x && pointY >= this.y && pointX < this.x + this.width && pointY < this.y + this.height
    }
}

class TerrainWrapper {

    constructor() {
    }

    generateMap(width, height, chunkSize) {
        return TerrainHandler.generateMap(width, height, chunkSize)
    }
    
    loadMap(terrain) {
        this.handler = new TerrainHandler(terrain.width, terrain.height, terrain.chunkSize, terrain.chunks)
        return this.handler
    }
}

class TerrainHandler extends Quad {
    chunkSize 
    chunks = []
    constructor(width, height, chunkSize, chunks) {
        super(0,0,width,height)
        this.chunkSize = chunkSize
        this.chunks = chunks
    }

    static generateMap(width, height, chunkSize, seed=Math.random()) {
        noise.seed(seed)
        let chunks = []
        const terrain = new TerrainHandler(width,height, chunkSize, chunks)
        for(let i=0;i<(width/chunkSize)*(height/chunkSize);i++) {
            chunks.push(Chunk.generateChunk(i, terrain))
        }
        terrain.chunks = chunks
        terrain.seed = seed
        return terrain
    }

    getWholeMap() {
        return this.chunks
    } 

    getChunkNeighbourhood(playerX, playerY) {
        const nMap = [
            [-1,-1],    [0,-1], [1,-1],
            [-1,0],     [0,0],  [1,0],
            [-1,1],     [0,1],  [1,1],
        ]
        return nMap.map(coords => this.getChunk(playerX+coords[0]*this.chunkSize,playerY+coords[1]*this.chunkSize))
    }

    getChunk(X, Y) {
        return this.chunks.find(chunk => chunk.pointInQuad(X,Y))
    }

}

class Chunk extends Quad {
    constructor(id, blocks, terrain) {
        const {x,y} = getXY(id, terrain.width/terrain.chunkSize)
        super(x*terrain.chunkSize,y*terrain.chunkSize,terrain.chunkSize,terrain.chunkSize)
        this.id = id
        this.blocks = blocks
        this.terrain = terrain
    } 

    static generateChunk(index, terrain) {
        let blocks = []
        const {chunkSize} = terrain
        const chunk = new Chunk(index, blocks, terrain)
        for(let i = 0; i < chunkSize * chunkSize; i++) {
            blocks.push(Block.generateBlock(i, chunk))
        }
        chunk.blocks = blocks
        return chunk
    }

}

class Block extends Quad{
    constructor(id, type, items, chunk) {
        const x = getXY(id, chunk.width).x + chunk.x
        const y = getXY(id, chunk.height).y + chunk.y
        super(x,y,1,1)
        this.id = id
        this.chunk = chunk
        this.terrain = chunk.terrain
        this.type = mapToBiome(generateValue(this.x,this.y))
        this.items = []
        const richness = generateItems(this.x,this.y) 
        this.moisture = this.moistureMapper(richness.moisture)
        this.materialRichness = this.materialRichnessMapper(richness.materialRichness)
        this.animals = this.animalsMapper(richness.animals)
    }


    moistureMapper(value) {
        if(this.type != biomes.PLAIN) return
        if(value<50) return 'DESERT'
        if(value<150) return 'FIELD'
        return 'FOREST'
    }
    
    materialRichnessMapper(value) {
        if(this.type != biomes.MOUNTAIN) return
        if(value<50) return 'GOLD'
        if(value<75) return 'IRON'
        if(value<100) return 'COPPER'
        return 'NOTHING'
    }

    animalsMapper(value) {
        if(value < 75 && this.type == biomes.WATER) return 'FISH'
        if(value < 40 && this.type == biomes.PLAIN) return 'DEER'
        return 'NO_ANIMAL'
    }

    static generateBlock(blockIndex, chunk) {
        return new Block(blockIndex, "PLAINS", [], chunk)
    }



}



function getXY(index, columns) {
    return {
        x: index % columns,
        y: Math.floor(index / columns)
    }
}

function map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

biomes = {
    WATER: 'WATER',
    PLAIN: 'PLAIN',
    MOUNTAIN: 'MOUNTAIN',
}


function mapToBiome(value) {
    if(value < 80) return biomes.MOUNTAIN
    if(value < 170) return biomes.PLAIN
    return biomes.WATER
}

function generateValue(x,y,size=5, weights = [1,2,4,8,16]) {
    const value = weights.map(n => noise.perlin2(x/size*n,y/size*n) * 1/n).reduce((a,b)=>a+b)
    // return Math.floor(map(value, -1, 1, 0, 255))
    return Math.floor(map(value, -1, 1, 0, 255))
}
function generateItems(x,y) {
    const moisture = generateValue(x,y,40)
    const materialRichness = generateValue(x,y,3)
    const animals = generateValue(x,y,3)
    return {moisture, materialRichness, animals}
}

module.exports = {
    terrainWrapper: new TerrainWrapper()
}