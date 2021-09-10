import { BadRequestException } from '@nestjs/common';
import { Terrain } from 'src/model/terrain/terrain.model';
import { Player } from 'src/model/users/player.model';
import { UsersService } from './users.service';

describe('State Service', () => {
  let userService: UsersService;
  const mockPlayer = new Player('mock', 0, 0);
  const mockPlayer2 = new Player('another', 10, 10);
  const players = [mockPlayer, mockPlayer2];
  const stateService = {
    players: players,
    findConnectedPlayer: (player: Player) => {
      return stateService.players.find((a) => a.name === player.name);
    },
    terrain: Terrain.generateMap(10, 10, 5),
  } as any;
  const usersFileService = {
    registerPlayer: (player: Player) => player,
  } as any;
  const configService = {
    get: (option: string) => {
      if (option === 'FRUSTUM_SIZE') return 5;
    },
  } as any;
  beforeAll(() => {
    userService = new UsersService(
      usersFileService,
      stateService,
      configService,
    );
    stateService.players = players;
  });

  it('should move player', () => {
    userService.movePlayer(mockPlayer, { x: 1, y: 1 });
    expect(mockPlayer.x).toBe(1);
    expect(mockPlayer.y).toBe(1);
  });

  it('should find connected player', () => {
    userService.findConnectedPlayer(mockPlayer);
  });

  it('should find connected player by name', () => {
    userService.findConnectedPlayerByName(mockPlayer.name);
  });

  it('should find players in Quad', () => {
    const players = userService.findVisiblePlayers(mockPlayer);
    expect(players).toHaveLength(1);
    expect(players[0]).toStrictEqual(mockPlayer);
  });

  it('should register player correctly', () => {
    const player = userService.registerPlayer({ name: 'new' } as any);
    expect(player).toStrictEqual(new Player('new', 10, 10));
  });

  it('should throw if player already connected', () => {
    const throwing = () =>
      userService.checkIfPlayerAlreadyConnected(mockPlayer);
    expect(throwing).toThrow(BadRequestException);
    expect(throwing).toThrow('player already connected: ' + mockPlayer.name);
  });
});
