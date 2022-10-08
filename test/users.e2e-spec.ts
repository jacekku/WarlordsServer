import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { TERRAIN_PERSISTENCE_SERVICE, WEBSOCKET } from 'src/constants';
import { UsersWebsocketGateway } from '@Users/adapters/api/users.gateway';
import { TerrainServiceMock, mockTerrain } from './mocks/terrain.service.mock';
import { characterMock } from './mocks/users.service.mock';
import { StateService } from 'src/state/state.service';
import { IUsersPersistence } from '@Users/domain/ports/repositories/usersRepo.port';
import { Terrain } from '@Terrain/model/terrain.model';
import { JwtAuthGuard } from '@Auth/jwt-auth.guard';
import { WsException } from '@nestjs/websockets';
import { UserPersistenceMock } from './mocks/user.repository.mock';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const wsClientMock = { emit: () => ({}) };

  const playerMock1 = { name: 'test1', x: 0, y: 0 } as any;
  const playerMock2 = { name: 'test2', x: 0, y: 0 } as any;

  let wsGateway: {
    server: any;
    playerConnected: (
      websocket: { emit: () => {} },
      command: { player: any; success: any },
    ) => any;
    movePlayer: (
      websocket: { emit: () => {} },
      command: {
        player: any;
        move: { x: number; y: number };
        success: { emit: () => {} };
      },
    ) => any;
    getUpdatedPlayers: (arg0: any) => any;
  };
  let wsClientEmit;
  let wsServerEmit;
  let stateService: StateService;

  beforeAll(async () => {
    process.env.PERSISTENCE_TYPE = 'file';
    process.env.DEFAULT_TERRAIN = 'none';
    jest.useFakeTimers();
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(() => {
        canActivate: () => true;
      })
      .overrideProvider(TERRAIN_PERSISTENCE_SERVICE)
      .useValue(TerrainServiceMock)
      .overrideProvider(IUsersPersistence)
      .useClass(UserPersistenceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.init();
    stateService = app.get(StateService);
  });

  beforeEach(async () => {
    stateService.players = [];
    stateService.terrain = mockTerrain as Terrain;
    (app.get(IUsersPersistence) as UserPersistenceMock).TEST_CLEAR_DB();

    wsGateway = app.get(UsersWebsocketGateway);
    wsClientEmit = jest.spyOn(wsClientMock, 'emit');
    wsServerEmit = jest.spyOn(wsGateway.server, 'emit');
  });

  afterAll(() => {
    app.close();
  });

  async function connectPlayer(player: { player: any; success: any }) {
    return wsGateway.playerConnected(wsClientMock, {
      player: player,
      success: wsClientMock,
    });
  }
  async function movePlayer(player: any, move: { x: number; y: number }) {
    await wsGateway.movePlayer(wsClientMock, {
      player,
      move,
      success: wsClientMock,
    });
  }

  describe('/character (POST)', () => {
    it('Should successfully create a character with expected position and name', () => {
      return request(app.getHttpServer())
        .post('/players/character')
        .send(characterMock)
        .then((result) => {
          expect(result.statusCode).toBe(201);
          const { x, y, name } = result.body;
          expect(name).toBe(characterMock.characterName);
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(mockTerrain.width);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(mockTerrain.height);
        });
    });
  });

  describe('Basic websocket connection', () => {
    it('players:connect', async () => {
      await connectPlayer(playerMock1);
      expect(wsClientEmit).toHaveBeenNthCalledWith(
        1,
        WEBSOCKET.PLAYERS.CONNECT,
      );
      expect(wsClientEmit).toHaveBeenNthCalledWith(
        2,
        WEBSOCKET.SUCCESS,
        wsClientMock,
      );

      expect(wsServerEmit).toHaveBeenCalledWith(WEBSOCKET.PLAYERS.UPDATE);
      expect(stateService.players).toHaveLength(1);
    });

    it('players:move', async () => {
      await connectPlayer(playerMock1);

      await movePlayer(playerMock1, { x: 1, y: 1 });

      expect(wsClientEmit).toHaveBeenCalledWith(
        WEBSOCKET.SUCCESS,
        wsClientMock,
      );
      expect(wsServerEmit).toHaveBeenCalledWith(WEBSOCKET.PLAYERS.UPDATE);
    });

    it('players:requestUpdate', async () => {
      await connectPlayer(playerMock1);
      const result = await wsGateway.getUpdatedPlayers(playerMock1);

      expect(result).toStrictEqual({
        event: WEBSOCKET.PLAYERS.REQUEST_UPDATE,
        data: [playerMock1],
      });
    });
  });

  describe('More complicated player interactions', () => {
    test('When 2 players of same name connect, throws exception', async () => {
      await connectPlayer(playerMock1);
      try {
        await connectPlayer(playerMock1);
      } catch (error) {
        expect(error).toBeInstanceOf(WsException);
      }
    });
    test('When 2 players are connected and in the same place, they should see each other', async () => {
      await connectPlayer(playerMock1);
      await connectPlayer(playerMock2);
      const res = await wsGateway.getUpdatedPlayers(playerMock1);
      expect(res.data).toHaveLength(2);
    });
    test('When 2 players are connected and far away, they should not see each other', async () => {
      await Promise.all([
        connectPlayer(playerMock1),
        connectPlayer(playerMock2),
      ]);
      await movePlayer(playerMock2, { x: 30, y: 30 });

      const res1 = await wsGateway.getUpdatedPlayers(playerMock1);
      expect(res1.data).toHaveLength(1);
      expect(res1.data[0]).toStrictEqual(playerMock1);

      const res2 = await wsGateway.getUpdatedPlayers(playerMock2);
      expect(res2.data).toHaveLength(1);
      const changedPlayer = {
        name: playerMock2.name,
        x: 30,
        y: 30,
      };
      expect(res2.data[0]).toStrictEqual(changedPlayer);
    });
  });
});
