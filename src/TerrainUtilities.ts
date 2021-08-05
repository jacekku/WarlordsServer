import { BIOMES } from "./model/enums/Biomes"
import { Terrain } from "./model/Terrain"
var Simplex = require('perlin-simplex')
import { Utilities } from "./Utilities"
export class TerrainUtilities {
    static mapToBiome(value: number) {
        if (value < 80) return BIOMES.MOUNTAIN
        if (value < 170) return BIOMES.PLAIN
        return BIOMES.WATER
    }

    static generateValue(x: number, y: number, size: number = 5, weights: number[] = [1, 2, 4, 8, 16]) {
        const simplex: any = new Simplex();
        const value = weights.map(n => simplex.noise(x / size * n, y / size * n) * 1 / n).reduce((a, b) => a + b)
        // return Math.floor(map(value, -1, 1, 0, 255))
        return Math.floor(Utilities.map(value, -1, 1, 0, 255))
    }
    static generateItems(x: number, y: number) {
        const moisture = TerrainUtilities.generateValue(x, y, 40)
        const materialRichness = TerrainUtilities.generateValue(x, y, 3)
        const animals = TerrainUtilities.generateValue(x, y, 3)
        return {
            moisture,
            materialRichness,
            animals
        }
    }
    static stringifyMap(terrain: Terrain): string {
        const excluded = ['chunk', 'terrain']
        return JSON.stringify(terrain, (key, value) => {
            if (excluded.includes(key)) {
                return undefined
            }
            return value
        })
    }

}