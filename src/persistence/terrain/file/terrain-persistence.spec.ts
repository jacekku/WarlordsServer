import * as fs from 'fs';
import { Terrain } from 'src/terrain/model/terrain.model';
import { TerrainFileService } from './terrain-persistence.service';
jest.mock('fs');
describe('Persistence Service', () => {
  let terrainService: TerrainFileService;
  const mockTerrain = Terrain.generateMap(10, 10, 2);
  const configService = {
    get: () => {
      return 'players';
    },
  } as any;

  const FILE_SYSTEM = {};

  beforeAll(() => {
    terrainService = new TerrainFileService(configService);
    jest.spyOn(fs, 'mkdirSync').mockImplementation((path: any) => {
      FILE_SYSTEM[path] = {};
      return path;
    });
    jest.spyOn(fs, 'existsSync').mockImplementation((path: any) => {
      return !!FILE_SYSTEM[path];
    });
    jest.spyOn(fs, 'writeFileSync').mockImplementation((path: any, data) => {
      FILE_SYSTEM[path] = data;
    });
    jest.spyOn(fs, 'readFileSync').mockImplementation((path: any) => {
      return FILE_SYSTEM[path];
    });
  });

  it('should save and return saved terrain', async () => {
    terrainService.saveMap(mockTerrain);
    const terrain = await terrainService.getMap(mockTerrain.mapId);
    expect(terrain.mapId).toBe(mockTerrain.mapId);
  });
});
