import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TerrainFileService } from 'src/persistence/terrain/file/terrain-persistence.service';
import { StateService } from 'src/state/state.service';
import { TerrainController } from '../terrain.controller';
import { TerrainService } from '../terrain.service';
import * as fs from 'fs';
import { Terrain } from '../model/terrain.model';
import { TERRAIN_PERSISTENCE_SERVICE } from 'src/constants';

jest.mock('fs');

describe('TerrainController', () => {
  let app: TestingModule;
  const FILE_SYSTEM = {};
  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [TerrainController],
      providers: [
        TerrainService,
        StateService,
        ConfigService,
        TerrainFileService,
        {
          provide: TERRAIN_PERSISTENCE_SERVICE,
          useClass: TerrainFileService,
        },
      ],
    }).compile();

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

  describe('Terrain Controller', () => {
    it('should generate and return terrain', () => {
      const terrainController = app.get<TerrainController>(TerrainController);
      const result = terrainController.generateMap(10, 10, 5);
      expect(result.mapId).toBeDefined();
      expect(result.chunkNumber).toBeDefined();
      expect(result.chunkSize).toBe(5);
      expect(result.chunks).toHaveLength(4);
    });

    it('should save terrain', () => {
      const terrainController = app.get<TerrainController>(TerrainController);
      const terrain = Terrain.generateMap(10, 10, 5);
      terrainController.saveMap(terrain);
    });

    it('should return terrain', async () => {
      const terrainController = app.get<TerrainController>(TerrainController);
      const result = await terrainController.generateAndSave(10, 10, 5);
      expect(result.mapId).toBeDefined();
      expect(result.chunkNumber).toBeDefined();
      expect(result.chunkSize).toBe(5);
      expect(result.chunks).toHaveLength(4);
    });
  });
});
