import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StateService } from 'src/state/state.service';
import * as fs from 'fs';
import { TerrainWebsocketGateway } from '../terrain.gateway';
import { TerrainService } from '../terrain.service';
import { Terrain } from '../model/terrain.model';
import { TERRAIN_PERSISTENCE_SERVICE } from 'src/constants';
import { TerrainFileService } from 'src/persistence/terrain/file/terrain-persistence.service';

jest.mock('fs');

describe('TerrainGateway', () => {
  let app: TestingModule;
  const FILE_SYSTEM = {};
  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        TerrainService,
        ConfigService,
        StateService,
        TerrainWebsocketGateway,
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

  it('should generate and return terrain', () => {
    const state = app.get<TerrainService>(TerrainService);
    state.terrain = Terrain.generateMap(10, 10, 2);

    const gateway = app.get<TerrainWebsocketGateway>(TerrainWebsocketGateway);
    const response = gateway.getTerrainInfo();
  });
});
