import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StateService } from 'src/state/state.service';
import * as fs from 'fs';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersFileService } from 'src/persistence/users/users-persistence.service';
import { Terrain } from 'src/model/terrain/terrain.model';

jest.mock('fs');

describe('UsersController', () => {
  let app: TestingModule;
  const FILE_SYSTEM = {};
  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, StateService, ConfigService, UsersFileService],
    }).compile();

    app.get<StateService>(StateService).terrain = Terrain.generateMap(5, 5, 1);

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

  describe('Users Controller', () => {
    it('should return player', () => {
      const usersController = app.get<UsersController>(UsersController);
      usersController.getPlayer('name');
    });
  });
});