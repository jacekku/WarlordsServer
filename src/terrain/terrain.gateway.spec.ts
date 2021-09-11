import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TerrainFileService } from 'src/persistence/terrain/terrain-persistence.service';
import { StateService } from 'src/state/state.service';
import * as fs from 'fs';
import { TerrainWebsocketGateway } from './terrain.gateway';
import { TerrainService } from './terrain.service';
import { Terrain } from 'src/model/terrain/terrain.model';

jest.mock('fs');

describe('TerrainGateway', () => {
  let app: TestingModule;
  const FILE_SYSTEM = {};
  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        TerrainService,
        StateService,
        ConfigService,
        TerrainFileService,
        TerrainWebsocketGateway,
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
