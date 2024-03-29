import { WsException } from '@nestjs/websockets';
import { Terrain } from '@Terrain/model/terrain.model';
import { GetPlayer } from '@Users/domain/ports/driving/getPlayer.port';
import { UsersService } from '@Users/usecase/users.service';
import { Player } from 'src/common_model/player.model';
import { mockTerrain } from 'test/mocks/terrain.service.mock';

describe('State Service', () => {
  let userService: UsersService;
  const mockPlayer = new Player('mock', 0, 0);
  const mockPlayer2 = new Player('another', 10, 10);
  const players = [mockPlayer, mockPlayer2];
  const stateService = {
    players: [...players],
    findConnectedPlayer: (player: Player) => {
      return stateService.players.find((a) => a.name === player.name);
    },
    findConnectedPlayerByName: (playerName: string) => {
      return stateService.players.find((a) => a.name === playerName);
    },
    terrain: Terrain.generateMap(10, 10, 5),
  } as any;
  const usersFileService = {
    registerPlayer: (player: Player) => {
      return player;
    },
    getPlayer: (playerName: string) =>
      players.find((p) => p.name === playerName),
    savePlayer: (player) => {
      return player;
    },
  } as any;
  const configService = {
    get: (option: string) => {
      if (option === 'FRUSTUM_SIZE') return 5;
    },
  } as any;

  const getPlayerUseCase = {
    execute(playerName) {
      return Promise.resolve(players.find((p) => p.name == playerName));
    },
  } as GetPlayer;
  beforeAll(() => {
    userService = new UsersService(
      usersFileService,
      stateService,
      configService,
      getPlayerUseCase,
    );
  });

  beforeEach(() => {
    stateService.players = [...players];
  });
  it('should find connected player by name', () => {
    userService.findConnectedPlayerByName(mockPlayer.name);
  });

  it('should find players in Quad', () => {
    const players = userService.findVisiblePlayers(mockPlayer);
    expect(players).toHaveLength(1);
    expect(players[0]).toEqual(mockPlayer);
  });

  it('should register player correctly', async () => {
    const player = await userService.registerPlayer({ name: 'new' } as any);
    expect(player.name).toBe('new');
    expect(player.x).toBeGreaterThanOrEqual(0);
    expect(player.y).toBeGreaterThanOrEqual(0);
    expect(player.x).toBeLessThanOrEqual(mockTerrain.width);
    expect(player.y).toBeLessThanOrEqual(mockTerrain.height);
  });

  it('should throw if player already connected', () => {
    const throwing = () =>
      userService.checkIfPlayerAlreadyConnected(mockPlayer);
    expect(throwing).toThrow(WsException);
    expect(throwing).toThrow('player already connected: ' + mockPlayer.name);
  });

  it('should push player to state service when connected', async () => {
    await userService.playerConnected({ name: 'newPlayer' } as any);
    expect(stateService.players[2].name).toBe('newPlayer');
  });

  // this will only save players or smth, it will not modify state
  // move this to e2e test to test the events
  it.skip('should disconnect connected player', async () => {
    await userService.playerConnected({ name: 'newPlayer' } as any);
    userService.playerDisconnected('newPlayer' as any);
    expect(stateService.players).toHaveLength(2);
  });

  it('should throw if player to disconnect not found ', () => {
    expect(
      userService.playerDisconnected({ name: 'notConnected' } as Player),
    ).toBe(undefined);
  });

  // removed this method
  // it.skip('should return all connected player', () => {
  // const conPlayers = userService.getAllConnectedPlayers();
  // expect(conPlayers).toHaveLength(2);
  // });
});
