import * as Simplex from 'perlin-simplex';
const simplex = new Simplex();
import { BIOMES } from 'src/model/terrain/enums/biomes.model';
import { Terrain } from 'src/model/terrain/terrain.model';
import { Utilities } from './utilities.service';
export class TerrainUtilities {
  static generateItems(x: number, y: number) {
    throw new Error('Method not implemented.');
  }
  //todo fix map generation to actually look decent
  static generateValue(x: number, y: number, size = 20) {
    const value = [1.5, 2, 3]
      .map((n) => simplex.noise(x / (size * n), y / (size * n)) * (1 / n))
      .reduce((val, sum) => val + sum);
    return Math.floor(Utilities.map(value, -1, 1, 0, 100));
  }
  static generateResources(x: number, y: number) {
    const moisture = TerrainUtilities.generateValue(x, y, 10);
    const materials = TerrainUtilities.generateValue(x, y, 1);
    const animals = TerrainUtilities.generateValue(x, y, 2);
    return {
      moisture,
      materials,
      animals,
    };
  }
  static stringifyMap(terrain: Terrain): string {
    const excluded = ['chunk', 'terrain'];
    return JSON.stringify(terrain, (key, value) => {
      if (excluded.includes(key)) {
        return undefined;
      }
      return value;
    });
  }

  static mapToBiome(value: number): BIOMES {
    if (value < 10) return BIOMES.DEEP_WATER;
    if (value < 20) return BIOMES.SHALLOW_WATER;
    if (value < 25) return BIOMES.BEACH;
    if (value < 80) return BIOMES.PLAIN;
    if (value < 85) return BIOMES.HILLS;
    return BIOMES.MOUNTAIN;
  }
}
