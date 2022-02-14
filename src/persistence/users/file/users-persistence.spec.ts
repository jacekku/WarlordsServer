import { Player } from 'src/users/model/player.model';
import { UsersFileService } from './users-persistence.service';
import * as fs from 'fs';
jest.mock('fs');
describe('Persistence Service', () => {
  let usersService: UsersFileService;
  const mockPlayer = new Player('mock_player', 0, 0);
  const configService = {
    get: () => {
      return 'players';
    },
  } as any;

  const FILE_SYSTEM = {};

  beforeAll(() => {
    usersService = new UsersFileService(configService);
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

  it('should register player and return player data sucessfully', async () => {
    const createdPlayer = await usersService.registerPlayer(
      mockPlayer,
      'mapId',
    );
    expect(createdPlayer.name).toBe(mockPlayer.name);
  });
});
