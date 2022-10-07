import { Player } from 'src/common_model/player.model';
import { UsersFileService } from '../adapters/repositories/file/users-persistence.service';
import * as fs from 'fs';
import { InMemoryUserRepository } from '@Users/adapters/repositories/inmemory/inmemory.users.repository';
jest.mock('fs');
describe('Persistence Service', () => {
  let usersService: InMemoryUserRepository;
  const mockPlayer = new Player('mock_player', 0, 0);
  const configService = {
    get: () => {
      return 'players';
    },
  } as any;

  beforeAll(() => {
    usersService = new InMemoryUserRepository();
  });

  it('should register player and return player data sucessfully', async () => {
    const createdPlayer = await usersService.savePlayer(mockPlayer, 'mapId');
    expect(createdPlayer.name).toBe(mockPlayer.name);
  });
});
