import { ITerrainPersistence } from '@Persistence/terrain/interfaces/terrain-persistence-interface.service';
import { Chunk } from '@Terrain/model/chunk.model';
import { Terrain } from '@Terrain/model/terrain.model';

export const mockTerrain = {
  width: 10,
  height: 10,
  mapId: 'mockMapId',
  getAvailableSpot() {
    return {
      x: 0,
      y: 0,
    };
  },
} as Terrain;

export class TerrainServiceMock implements ITerrainPersistence {
  saveMap(terrain: Terrain): void {
    throw new Error('Method not implemented.');
  }
  getMap(mapId: string): Promise<Terrain> {
    return Promise.resolve(mockTerrain);
  }
  getChunk(mapId: string, chunkId: number): Promise<Chunk> {
    throw new Error('Method not implemented.');
  }
  saveChunk(mapPath: string, chunk: Chunk): void {
    throw new Error('Method not implemented.');
  }
}
