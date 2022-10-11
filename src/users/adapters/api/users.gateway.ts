import { ConfigurableLogger } from '@Logging/logging.service';
import {
  WebSocketGateway,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  WsResponse,
  MessageBody,
} from '@nestjs/websockets';
import { Player } from 'src/common_model/player.model';
import { UsersService } from '@Users/usecase/users.service';
import { Server } from 'socket.io';
import { WEBSOCKET } from 'src/constants';
import { StateService } from '@State/state.service';
import { Inject } from '@nestjs/common';
import { PlayerDisconnected } from '@Users/domain/ports/command/playerDisconnected.port';
import { PlayerConnected } from '@Users/domain/ports/command/playerConnected.port';
import { PlayerMove } from '@Users/domain/ports/command/playerMove.port';

@WebSocketGateway({
  cors: {
    origin: (host: string, callback) => {
      callback(null, process.env.CORS_ORIGIN.split(','));
    },
  },
})
export class UsersWebsocketGateway implements OnGatewayDisconnect {
  private readonly logger = new ConfigurableLogger(UsersWebsocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UsersService,
    private readonly stateService: StateService,
    @Inject(PlayerDisconnected) private playerDisconnected: PlayerDisconnected,
    @Inject(PlayerConnected) private playerConnected: PlayerConnected,
    @Inject(PlayerMove) private playerMove: PlayerMove,
  ) {}

  @SubscribeMessage(WEBSOCKET.PLAYERS.ALL)
  getAllPlayers(): WsResponse<any> {
    //TODO: this is just reporting state, extract to state service?
    return this.buildResponse(WEBSOCKET.PLAYERS.ALL, this.stateService.players);
  }

  @SubscribeMessage(WEBSOCKET.PLAYERS.REQUEST_UPDATE)
  getUpdatedPlayers(
    @MessageBody('player') player: Player,
  ): WsResponse<Player[]> {
    const connectedPlayer = this.userService.findConnectedPlayerByName(
      player.name,
    );
    return this.buildResponse(
      WEBSOCKET.PLAYERS.REQUEST_UPDATE,
      this.userService.findVisiblePlayers(connectedPlayer),
    );
  }

  @SubscribeMessage(WEBSOCKET.PLAYERS.MOVE)
  movePlayer(
    client: any,
    payload: { player: Player; move: { x: number; y: number }; success: any },
  ) {
    const { player, move, success } = payload;

    this.playerMove.execute(player, move);

    this.emitToAllPlayers(WEBSOCKET.PLAYERS.UPDATE);
    client.emit(WEBSOCKET.SUCCESS, success);
  }

  @SubscribeMessage(WEBSOCKET.PLAYERS.CONNECT)
  async playerConnectedHandler(
    client: any,
    payload: { player: Player; success: any },
  ) {
    this.logger.log('player connected: ' + client.player);
    const { player, success } = payload;

    await this.playerConnected.execute(player);

    this.pushPlayerNameToSocketClient(client, player);
    client.emit(WEBSOCKET.PLAYERS.CONNECT);
    client.emit(WEBSOCKET.SUCCESS, success);
    this.emitToAllPlayers(WEBSOCKET.PLAYERS.UPDATE);
  }

  async handleDisconnect(client: any) {
    this.logger.log('player disconnected: ' + client.player);
    if (!client.player) return;
    this.playerDisconnected.execute(client.player);
    this.emitToAllPlayers(WEBSOCKET.PLAYERS.UPDATE);
  }

  buildResponse(event: string, data: any): WsResponse<any> {
    return { event, data };
  }

  pushPlayerNameToSocketClient(client: any, player: Player) {
    client.player = player.name;
  }

  emitToAllPlayers(event: string) {
    this.server.emit(event);
  }
}
