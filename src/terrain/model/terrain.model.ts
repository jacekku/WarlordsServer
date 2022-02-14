import { Prop, Schema } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Utilities } from 'src/terrain/utilities/utilities.service';
import { Chunk } from './chunk.model';
import { Quad } from './quad.model';

@Schema()
export class Terrain extends Quad {
  @Prop()
  chunkSize: number;
  // @Prop()
  chunks: Chunk[];
  @Prop()
  mapId: string;
  @Prop()
  chunkNumber: number;

  constructor(
    width: number,
    height: number,
    chunkSize: number,
    chunks: Chunk[],
    mapId: string,
    chunkNumber: number,
  ) {
    super(0, 0, width, height);
    this.chunkSize = chunkSize;
    this.chunks = chunks;
    this.mapId = mapId;
    this.chunkNumber = chunkNumber;
  }

  static generateMap(width: number, height: number, chunkSize: number) {
    chunkSize = Number(chunkSize);
    const chunks: Chunk[] = [];
    const terrain = new Terrain(
      width,
      height,
      chunkSize,
      chunks,
      Utilities.generateStringId(),
      0,
    );
    for (let i = 0; i < (width / chunkSize) * (height / chunkSize); i++) {
      chunks.push(Chunk.generateChunk(i, terrain));
    }
    terrain.chunks = chunks;
    terrain.chunkNumber = chunks.length;
    return terrain;
  }

  toJSON() {
    return _.omit(this, ['chunks']);
  }

  getWholeMap() {
    return this.chunks;
  }

  getChunkNeighbourhood(playerX: number, playerY: number) {
    const nMap = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [0, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    return {
      width: this.width,
      height: this.height,
      playerChunk: this.getChunk(playerX, playerY).id,
      chunks: nMap
        .map((coords) =>
          this.getChunk(
            playerX + coords[0] * this.chunkSize,
            playerY + coords[1] * this.chunkSize,
          ),
        )
        .filter(Boolean),
    };
  }

  getChunk(X: number, Y: number): Chunk {
    return this.chunks.find((chunk) => Quad.pointInQuad(chunk, X, Y));
  }

  static fromStorage(terrain: any): Terrain {
    const newTerrain: Terrain = new Terrain(
      terrain.width,
      terrain.height,
      terrain.chunkSize,
      [],
      terrain.mapId,
      terrain.chunkNumber,
    );
    return newTerrain;
  }
}
