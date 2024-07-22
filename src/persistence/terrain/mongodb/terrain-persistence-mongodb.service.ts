import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Chunk } from 'src/terrain/model/chunk.model';
import { Terrain } from 'src/terrain/model/terrain.model';
import { ITerrainPersistence } from '../interfaces/terrain-persistence-interface.service';
import { ChunkDocument, TerrainDocument } from './schema/terrain.schema';

@Injectable()
export class TerrainMongoService implements ITerrainPersistence {
  constructor(
    private chunkModel: Model<ChunkDocument>,
    private terrainModel: Model<TerrainDocument>,
  ) {}

  async saveMap(terrain: Terrain): Promise<void> {
    new this.terrainModel(terrain).save();
    if (!terrain || !terrain.chunks) return;
    await Promise.all(
      terrain.chunks.map((chunk) => this.saveChunk(terrain.mapId, chunk)),
    );
  }

  async getMap(mapId: string): Promise<Terrain> {
    const terrain = await this.terrainModel
      .findOne({ $and: [{ mapId: mapId }] })
      .exec();
    terrain.chunks = [];
    for (let index = 0; index < terrain.chunkNumber; index++) {
      terrain.chunks.push(await this.getChunk(terrain.mapId, index));
    }
    return terrain;
  }

  async getChunk(mapId: string, chunkId: number): Promise<Chunk> {
    return this.chunkModel
      .findOne({
        $and: [{ mapId }, { id: chunkId }],
      })
      .exec();
  }

  async saveChunk(mapId: string, chunk: Chunk): Promise<void> {
    chunk.mapId = mapId;
    await new this.chunkModel(chunk).save();
  }
}
