import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { TERRAIN_PERSISTENCE_SERVICE, WEBSOCKET } from 'src/constants';
import { UsersWebsocketGateway } from '@Users/adapters/api/users.gateway';
import { TerrainServiceMock, mockTerrain } from './mocks/terrain.service.mock';
import { characterMock } from './mocks/users.service.mock';
import { StateService } from 'src/state/state.service';
import { IUsersPersistence } from '@Users/domain/ports/users-persistence-interface.service';
import { InMemoryUserRepository } from '@Users/adapters/repositories/inmemory/inmemory.users.repository';
import { Terrain } from '@Terrain/model/terrain.model';
import { JwtAuthGuard } from '@Auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const wsClientMock = { emit: () => ({}) };

  const playerMock = { name: 'test', x: 0, y: 0 } as any;

  beforeAll(async () => {
    process.env.PERSISTENCE_TYPE = 'file';
    process.env.DEFAULT_TERRAIN = 'none';
    jest.useFakeTimers();
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        { provide: IUsersPersistence, useClass: InMemoryUserRepository },
        { provide: TERRAIN_PERSISTENCE_SERVICE, useValue: TerrainServiceMock },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(() => {
        canActivate: () => true;
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.init();
  });

  beforeEach(async () => {
    app.get(StateService).players = [];
    app.get(StateService).terrain = mockTerrain as Terrain;
    app.get(IUsersPersistence).savePlayer(playerMock, mockTerrain.mapId);
  });

  afterAll(() => {
    app.close();
  });

  it('/character (POST)', async () => {
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

  it('websocket players:connect', async () => {
    const gateway = app.get(UsersWebsocketGateway);

    const clientSpy = jest.spyOn(wsClientMock, 'emit');
    const serverSpy = jest.spyOn(gateway.server, 'emit');

    await gateway.playerConnected(wsClientMock, {
      player: playerMock,
      success: wsClientMock,
    });
    expect(clientSpy).toHaveBeenCalledTimes(2);
    expect(clientSpy).toHaveBeenNthCalledWith(1, WEBSOCKET.PLAYERS.CONNECT);
    expect(clientSpy).toHaveBeenNthCalledWith(
      2,
      WEBSOCKET.SUCCESS,
      wsClientMock,
    );

    expect(serverSpy).toHaveBeenCalledWith(WEBSOCKET.PLAYERS.UPDATE);

    clientSpy.mockRestore();
  });

  it('websocket players:move', async () => {
    const gateway = app.get(UsersWebsocketGateway);

    const clientSpy = jest.spyOn(wsClientMock, 'emit');
    const serverSpy = jest.spyOn(gateway.server, 'emit');
    await gateway.playerConnected(wsClientMock, { player: playerMock } as any);

    await gateway.movePlayer(wsClientMock, {
      player: playerMock,
      move: { x: 1, y: 1 },
      success: wsClientMock,
    });

    expect(clientSpy).toHaveBeenCalledWith(WEBSOCKET.SUCCESS, wsClientMock);
    expect(serverSpy).toHaveBeenCalledWith(WEBSOCKET.PLAYERS.UPDATE);

    clientSpy.mockRestore();
  });

  it('websocket players:requestUpdate', async () => {
    const gateway = app.get(UsersWebsocketGateway);

    await gateway.playerConnected(wsClientMock, { player: playerMock } as any);
    const result = await gateway.getUpdatedPlayers(playerMock);

    expect(result).toStrictEqual({
      event: WEBSOCKET.PLAYERS.REQUEST_UPDATE,
      data: [playerMock],
    });
  });
});
