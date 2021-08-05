const {terrainWrapper} = require('./TerrainHandler')
const {stringifyMap} = require('./utils')
const fs = require('fs');



const [width, height, chunkSize] = process.argv.slice(2).map(Number)
console.time()
const terrain = stringifyMap(terrainWrapper.generateMap(width, height, chunkSize))
fs.writeFileSync(`./maps/map-${width}x${height}x${chunkSize}-${Date.now()}.json`, terrain);
console.timeEnd()

