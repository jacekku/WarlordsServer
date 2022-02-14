import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { Chunk } from 'src/terrain/model/chunk.model';
import { Terrain } from 'src/terrain/model/terrain.model';
import { ITerrainPersistence } from '../interfaces/terrain-persistence-interface.service';

@Injectable()
export class TerrainFileService implements ITerrainPersistence {
  constructor(private configService: ConfigService) {}

  private TERRAIN_FOLDER = `${this.configService.get(
    'SAVE_FOLDER',
  )}/mapId/terrain`;

  saveMap(terrain: Terrain): void {
    if (!fs.existsSync(this.getTerrainPath(terrain.mapId))) {
      fs.mkdirSync(this.getTerrainPath(terrain.mapId), { recursive: true });
    }
    terrain.chunks.forEach((chunk) =>
      this.saveChunk(this.getTerrainPath(terrain.mapId), chunk),
    );
    fs.writeFileSync(
      `${this.getTerrainPath(terrain.mapId)}/terrainData.json`,
      JSON.stringify(terrain),
    );
  }

  async getMap(mapId: string): Promise<Terrain> {
    const terrainData = fs.readFileSync(
      `${this.getTerrainPath(mapId)}/terrainData.json`,
    );
    const terrain: Terrain = Terrain.fromStorage(
      JSON.parse(terrainData.toString()),
    );
    for (let index = 0; index < terrain.chunkNumber; index++) {
      terrain.chunks.push(await this.getChunk(terrain.mapId, index));
    }
    return terrain;
  }
  async getChunk(mapId: string, chunkId: number): Promise<Chunk> {
    const chunkData = fs.readFileSync(
      `${this.getTerrainPath(mapId)}/${chunkId}.json`,
    );
    return JSON.parse(chunkData.toString());
  }

  saveChunk(mapPath: string, chunk: Chunk): void {
    fs.writeFileSync(`${mapPath}/${chunk.id}.json`, JSON.stringify(chunk));
  }

  private getTerrainPath(mapId: string): string {
    return this.TERRAIN_FOLDER.replace('mapId', mapId);
  }
}
