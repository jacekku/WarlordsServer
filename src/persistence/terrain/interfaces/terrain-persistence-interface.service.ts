import { Chunk } from 'src/terrain/model/chunk.model';
import { Terrain } from 'src/terrain/model/terrain.model';

export interface ITerrainPersistence {
  saveMap(terrain: Terrain): void;
  getMap(mapId: string): Promise<Terrain>;
  getChunk(mapId: string, chunkId: number): Promise<Chunk>;
  saveChunk(mapPath: string, chunk: Chunk): void;
}
