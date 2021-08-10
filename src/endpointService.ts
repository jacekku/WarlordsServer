import { Request, Response } from "express-serve-static-core";
import { Chunk } from "./model/Chunk";
import {
    Terrain
} from "./model/Terrain"
import { PermanentStorage } from "./storage/PermanentStorage";
import {
    TerrainWrapper
} from "./TerrainHandler"

export class EndpointService {
    terrainWrapper: TerrainWrapper;
    permanentStorage: PermanentStorage;

    constructor(terrainWrapper: TerrainWrapper, permanentStorage: PermanentStorage) {
        this.terrainWrapper = terrainWrapper;
        this.permanentStorage = permanentStorage;
    }

    getWholeMap(req: Request, res: Response) {
        if (!this.terrainWrapper.terrain) {
            res.status(400).send("No loaded map")
            return
        }
        return this.terrainWrapper.terrain
    }

    // loadFromFile() {
    //     const terrain = fs.readFileSync('maps/map-100x100x10-1609325555649.json')
    //     this.terrainWrapper.loadMap(JSON.parse(terrain))
    //     console.log('loaded map from file')
    //     return true
    // }

    // async reloadRecentMap() {
    //     const map = await this.permanentStorage.getMostRecentMap()
    //     this.terrainWrapper.loadMap(map)
    //     console.log('loaded recent map')
    //     return true
    // }

    getChunk(chunkId: string): Chunk {
        return this.permanentStorage.getChunk(this.terrainWrapper.terrain.mapId, Number(chunkId))
    }

    async reloadMapFromId(mapId: string) {
        // if (mapId == "recent") {
        //     return await this.reloadRecentMap()
        // }
        const map = await this.permanentStorage.getMap(mapId)
        this.terrainWrapper.loadMap(map)
        return true
    }

    async getPlayer(playerName: string) {
        return await this.permanentStorage.getPlayer(this.terrainWrapper.terrain.mapId, playerName)
    }

    saveMap(terrain: Terrain): Terrain {
        this.permanentStorage.saveMap(terrain)
        return this.permanentStorage.getMap(terrain.mapId)
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