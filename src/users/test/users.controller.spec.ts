import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersFileService } from '@Persistence/users/file/users-persistence.service';
import { StateService } from '@State/state.service';
import { Terrain } from '@Terrain/model/terrain.model';
import { UsersController } from '@Users/users.controller';
import { UsersService } from '@Users/users.service';
import { USERS_PERSISTENCE_SERVICE } from 'src/constants';
import * as fs from 'fs';

describe('UsersController', () => {
  let app: TestingModule;
  const FILE_SYSTEM = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        StateService,
        ConfigService,
        {
          provide: USERS_PERSISTENCE_SERVICE,
          useClass: UsersFileService,
        },
      ],
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
