const {terrainWrapper} = require('./TerrainHandler')
const firebaseService = require('./firebaseService')
const {stringifyMap} = require('./utils')
function getWholeMap() {
    if(!terrainWrapper.handler) {
        console.error('@@@\nno loaded map\n@@@')
        return
    }
    return terrainWrapper.handler.getWholeMap()
}

async function reloadRecentMap() {
    const map = await firebaseService.getMostRecentMap()
    terrainWrapper.loadMap(JSON.parse(map.terrain))
    return true
}

async function reloadMapFromId(mapId) {
    if(!mapId){
        return await reloadRecentMap()
    }
    const map = await firebaseService.getMap(mapId)
    terrainWrapper.loadMap(JSON.parse(map.terrain))
    return true
}

async function getPlayer(player) {
    return await firebaseService.getPlayer(player)
}

async function saveMap(terrain) {
    await firebaseService.saveMap(terrain)
}


function generateMap(options) {
    const {width,height, chunkSize} = options
    const terrain = terrainWrapper.generateMap(width, height, chunkSize)
    return stringifyMap(terrain)
}



module.exports = {
    getWholeMap, 
    getPlayer, 
    generateMap, 
    reloadRecentMap,
    reloadMapFromId,
    saveMap,
}