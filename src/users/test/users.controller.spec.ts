import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { StateService } from '@State/state.service';
import { Terrain } from '@Terrain/model/terrain.model';
import { UsersService } from '@Users/usecase/users.service';
import { IUsersPersistence } from '@Users/domain/ports/repositories/usersRepo.port';
import { InMemoryUserRepository } from '@Users/adapters/repositories/inmemory/inmemory.users.repository';
import { QueryUsersController } from '@Users/adapters/api/queryUser.controller';

describe('UsersController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [QueryUsersController],
      providers: [
        UsersService,
        StateService,
        ConfigService,
        {
          provide: IUsersPersistence,
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    app.get<StateService>(StateService).terrain = Terrain.generateMap(5, 5, 1);
  });

  describe('Users Controller', () => {
    it.skip('should return player', () => {
      const usersController =
        app.get<QueryUsersController>(QueryUsersController);
      usersController.getPlayer('name');
    });
  });
});
