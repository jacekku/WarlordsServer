const {
    terrainWrapper
} = require('./TerrainHandler')
const firebaseService = require('./firebaseService')
const {
    stringifyMap
} = require('./utils')
const fs = require('fs')

function getWholeMap() {
    if (!terrainWrapper.handler) {
        console.error('@@@\nno loaded map\n@@@')
        return
    }
    return terrainWrapper.handler.getWholeMap()
}

function loadFromFile() {
    const terrain = fs.readFileSync('maps/map-100x100x10-1609325555649.json')
    terrainWrapper.loadMap(JSON.parse(terrain))
    console.log('loaded map from file')
    return true
}

async function reloadRecentMap() {
    const map = await firebaseService.getMostRecentMap()
    terrainWrapper.loadMap(JSON.parse(map.terrain))
    console.log('loaded recent map')
    return true
}

async function reloadMapFromId(mapId) {
    if (mapId == "recent") {
        return await reloadRecentMap()
    }
    const map = await firebaseService.getMap(mapId)
    terrainWrapper.loadMap(JSON.parse(map.terrain))
    console.log('loaded map: ' + mapId)

    return true
}

async function getPlayer(player) {
    return await firebaseService.getPlayer(player)
}

async function saveMap(terrain) {
    await firebaseService.saveMap(terrain)
}


function generateMap(options) {
    const {
        width,
        height,
        chunkSize
    } = options
    const terrain = terrainWrapper.generateMap(width, height, chunkSize)
    return stringifyMap(terrain)
}



module.exports = {
    getWholeMap,
    getPlayer,
    generateMap,
    reloadRecentMap,
    reloadMapFromId,
    loadFromFile,
    saveMap,
}