import {
    Terrain
} from "./model/Terrain"
import {
    TerrainWrapper
} from "./TerrainHandler"
import { TerrainUtilities } from "./TerrainUtilities";
const firebaseService = require('./firebaseService')
const fs = require('fs')

export class EndpointService {
    terrainWrapper: TerrainWrapper = TerrainWrapper.getInstance();

    getWholeMap() {
        if (!this.terrainWrapper.handler) {
            console.error('@@@\nno loaded map\n@@@')
            return
        }
        return this.terrainWrapper.handler.getWholeMap()
    }

    loadFromFile() {
        const terrain = fs.readFileSync('maps/map-100x100x10-1609325555649.json')
        this.terrainWrapper.loadMap(JSON.parse(terrain))
        console.log('loaded map from file')
        return true
    }

    async reloadRecentMap() {
        const map = await firebaseService.getMostRecentMap()
        this.terrainWrapper.loadMap(map)
        console.log('loaded recent map')
        return true
    }

    async reloadMapFromId(mapId: string) {
        if (mapId == "recent") {
            return await this.reloadRecentMap()
        }
        const map = await firebaseService.getMap(mapId)
        this.terrainWrapper.loadMap(JSON.parse(map.terrain))
        console.log('loaded map: ' + mapId)

        return true
    }

    async getPlayer(playerName: string) {
        return await firebaseService.getPlayer(playerName)
    }

    async saveMap(terrain: Terrain) {
        await firebaseService.saveMap(terrain)
    }


    generateMap(options: any): Terrain {
        const {
            width,
            height,
            chunkSize
        } = options
        const terrain = this.terrainWrapper.generateMap(width, height, chunkSize)
        return terrain;
    }

}