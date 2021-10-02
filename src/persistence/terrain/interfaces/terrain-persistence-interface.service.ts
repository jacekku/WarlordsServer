import { Chunk } from 'src/terrain/model/chunk.model';
import { Terrain } from 'src/terrain/model/terrain.model';

export interface ITerrainPersistence {
  saveMap(terrain: Terrain): Terrain;
  getMap(mapId: string): Terrain;
  getChunk(mapId: string, chunkId: number): Chunk;
  saveChunk(mapPath: string, chunk: Chunk): void;
}
