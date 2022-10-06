import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { TerrainFileService } from '@Persistence/terrain/file/terrain-persistence.service';
import { StateService } from '@State/state.service';
import { Terrain } from '@Terrain/model/terrain.model';
import { TerrainWebsocketGateway } from '@Terrain/terrain.gateway';
import { TerrainService } from '@Terrain/terrain.service';
import * as fs from 'fs';
import { TERRAIN_PERSISTENCE_SERVICE } from 'src/constants';

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
