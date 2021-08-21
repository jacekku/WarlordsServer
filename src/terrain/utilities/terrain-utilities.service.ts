import Simplex = require('perlin-simplex');
const simplex = new Simplex();
import { BIOMES } from 'src/model/terrain/enums/biomes.model';
import { Terrain } from 'src/model/terrain/terrain.model';
import { Utilities } from './utilities.service';
export class TerrainUtilities {
  static mapToBiome(value: number) {
    if (value < 10) return BIOMES.WATER;
    if (value < 20) return BIOMES.BEACH;
    if (value < 80) return BIOMES.PLAIN;
    return BIOMES.MOUNTAIN;
  }
  //todo fix map generation to actually look decent
  static generateValue(x: number, y: number, size = 20) {
    const value = [1, 2, 4, 8]
      .map((n) => simplex.noise(x / (size * n), y / (size * n)) * (1 / n))
      .reduce((val, sum) => val + sum);
    return Math.floor(Utilities.map(value, -1, 1, 0, 100));
  }
  static generateItems(x: number, y: number) {
    const moisture = TerrainUtilities.generateValue(x, y, 10);
    const materialRichness = TerrainUtilities.generateValue(x, y, 5);
    const animals = TerrainUtilities.generateValue(x, y, 2);
    return {
      moisture,
      materialRichness,
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
}
