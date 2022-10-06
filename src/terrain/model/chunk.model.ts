import { Prop, Schema } from '@nestjs/mongoose';
import { Block } from '@Terrain/model/block.model';
import { Quad } from '@Terrain/model/quad.model';
import { Terrain } from '@Terrain/model/terrain.model';
import { Utilities } from '@Terrain/utilities/utilities.service';

@Schema()
export class Chunk extends Quad {
  @Prop()
  id: number;
  @Prop()
  mapId: string;
  @Prop()
  blocks: Block[];

  constructor(id: number, blocks: Block[], terrain: Terrain) {
    const { x, y } = Utilities.getXY(id, terrain.width / terrain.chunkSize);
    super(
      x * terrain.chunkSize,
      y * terrain.chunkSize,
      terrain.chunkSize,
      terrain.chunkSize,
    );
    this.id = id;
    this.blocks = blocks;
  }

  static generateChunk(index: number, terrain: Terrain) {
    const blocks: Block[] = [];
    const { chunkSize } = terrain;
    const chunk: Chunk = new Chunk(index, blocks, terrain);
    for (let i = 0; i < chunkSize * chunkSize; i++) {
      blocks.push(Block.generateBlock(i, chunk));
    }
    chunk.blocks = blocks;
    return chunk;
  }
}
