import { Terrain } from "./model/Terrain"

export class TerrainWrapper {
    handler: Terrain;
    private static instance: TerrainWrapper;
    
    constructor() {
        this.handler = this.generateMap(10,10, 10);
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
        this.handler = new Terrain(terrain.width, terrain.height, terrain.chunkSize, terrain.chunks)
        return this.handler
    }
}