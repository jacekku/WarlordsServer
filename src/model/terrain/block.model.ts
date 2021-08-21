import { TerrainUtilities } from 'src/terrain/utilities/terrain-utilities.service';
import { Utilities } from 'src/terrain/utilities/utilities.service';
import { Chunk } from './chunk.model';
import { ANIMALS } from './enums/animals.model';
import { BIOMES } from './enums/biomes.model';
import { MATERIAL_RICHNESS } from './enums/material-richness.model';
import { MOISTURE } from './enums/moisture.model';
import { Quad } from './quad.model';

export class Block extends Quad {
  id: number;
  type: BIOMES;
  items: any[];
  moisture: MOISTURE;
  materialRichness: MATERIAL_RICHNESS;
  animals: ANIMALS;

  constructor(id: number, type: BIOMES, items: any[], chunk: Chunk) {
    const x = Utilities.getXY(id, chunk.width).x + chunk.x;
    const y = Utilities.getXY(id, chunk.height).y + chunk.y;
    super(x, y, 1, 1);
    this.id = id;
    this.type = TerrainUtilities.mapToBiome(
      TerrainUtilities.generateValue(this.x, this.y),
    );
    this.items = [];
    const richness = TerrainUtilities.generateItems(this.x, this.y);
    this.moisture = this.moistureMapper(richness.moisture);
    this.materialRichness = this.materialRichnessMapper(
      richness.materialRichness,
    );
    this.animals = this.animalsMapper(richness.animals);
  }

  moistureMapper(value: number): MOISTURE {
    if (this.type != BIOMES.PLAIN) return MOISTURE.NONE;
    if (value < 5) return MOISTURE.DESERT;
    if (value < 50) return MOISTURE.FIELD;
    return MOISTURE.FOREST;
  }

  materialRichnessMapper(value: number): MATERIAL_RICHNESS {
    if (this.type != BIOMES.MOUNTAIN) return MATERIAL_RICHNESS.NOTHING;
    if (value < 5) return MATERIAL_RICHNESS.GOLD;
    if (value < 20) return MATERIAL_RICHNESS.IRON;
    if (value < 35) return MATERIAL_RICHNESS.COPPER;
    return MATERIAL_RICHNESS.NOTHING;
  }

  animalsMapper(value: number): ANIMALS {
    if (value < 35 && this.type == BIOMES.WATER) return ANIMALS.FISH;
    if (
      value < 25 &&
      this.type == BIOMES.PLAIN &&
      this.moisture == MOISTURE.FOREST
    )
      return ANIMALS.DEER;
    return ANIMALS.NO_ANIMAL;
  }

  static generateBlock(blockIndex: number, chunk: Chunk) {
    return new Block(blockIndex, BIOMES.PLAIN, [], chunk);
  }
}
