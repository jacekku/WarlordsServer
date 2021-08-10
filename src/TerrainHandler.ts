import { Terrain } from "./model/Terrain"

export class TerrainWrapper {
    terrain: Terrain;
    private static instance: TerrainWrapper;
    
    constructor() {
        this.terrain = null;
    }

    public static getInstance(): TerrainWrapper {
        if (!TerrainWrapper.instance) {
            TerrainWrapper.instance = new TerrainWrapper();
        }

        return TerrainWrapper.instance;
    }


    generateMap(width: number, height: number, chunkSize: number) {
        return Terrain.generateMap(width, height, chunkSize)
    }
    
    loadMap(terrain: Terrain) {
        this.terrain = new Terrain(terrain.width, terrain.height, terrain.chunkSize, terrain.chunks, terrain.mapId, terrain.chunkNumber)
        return this.terrain
    }
}