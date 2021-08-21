import { Chunk } from 'src/model/terrain/chunk.model';
import { Terrain } from 'src/model/terrain/terrain.model';

export interface ITerrainPersistence {
  saveMap(terrain: Terrain): Terrain;
  getMap(mapId: string): Terrain;
  getChunk(mapId: string, chunkId: number): Chunk;
  saveChunk(mapPath: string, chunk: Chunk): void;
}
