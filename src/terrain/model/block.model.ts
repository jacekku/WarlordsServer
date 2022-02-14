import { Prop } from '@nestjs/mongoose';
import { TerrainUtilities } from 'src/terrain/utilities/terrain-utilities.service';
import { Utilities } from 'src/terrain/utilities/utilities.service';
import { Chunk } from './chunk.model';
import { ANIMALS } from './enums/animals.model';
import { BIOMES } from './enums/biomes.model';
import { MATERIALS } from './enums/materials.model';
import { MOISTURE } from './enums/moisture.model';
import { Quad } from './quad.model';

export class Block extends Quad {
  @Prop()
  id: number;
  @Prop({ enum: BIOMES })
  biome: BIOMES;
  @Prop({ enum: MOISTURE })
  moisture: MOISTURE;
  @Prop()
  materials: string;
  @Prop({ enum: ANIMALS })
  animals: ANIMALS;

  constructor(id: number, chunk: Chunk) {
    const x = Utilities.getXY(id, chunk.width).x + chunk.x;
    const y = Utilities.getXY(id, chunk.height).y + chunk.y;
    super(x, y, 1, 1);
    this.id = id;
    this.biome = TerrainUtilities.mapToBiome(
      TerrainUtilities.generateValue(this.x, this.y),
    );
    const richness = TerrainUtilities.generateResources(this.x, this.y);
    this.moisture = this.moistureMapper(richness.moisture);
    this.materials = this.materialRichnessMapper(richness.materials);
    this.animals = this.animalsMapper(richness.animals);
  }

  moistureMapper(value: number): MOISTURE {
    if (this.biome != BIOMES.PLAIN) return MOISTURE.NONE;
    if (value < 5) return MOISTURE.DESERT;
    if (value < 50) return MOISTURE.FIELD;
    return MOISTURE.FOREST;
  }

  materialRichnessMapper(value: number): MATERIALS {
    // if (this.type != BIOMES.MOUNTAIN) return MATERIALS.NONE;
    if (value < 2) return MATERIALS.GOLD;
    if (value < 4) return MATERIALS.IRON;
    if (value < 8) return MATERIALS.COPPER;
    if (value < 10) return MATERIALS.TIN;
    if (value < 12) return MATERIALS.IRON;
    if (value < 14) return MATERIALS.SALT;
    if (value < 16) return MATERIALS.OIL;
    if (value < 18) return MATERIALS.COAL;
    return MATERIALS.NONE;
  }

  animalsMapper(value: number): ANIMALS {
    if (value < 35 && this.biome == BIOMES.DEEP_WATER) return ANIMALS.FISH;
    if (
      value < 25 &&
      this.biome == BIOMES.PLAIN &&
      this.moisture == MOISTURE.FOREST
    )
      return ANIMALS.DEER;
    return ANIMALS.NONE;
  }

  static generateBlock(blockIndex: number, chunk: Chunk) {
    return new Block(blockIndex, chunk);
  }
}
