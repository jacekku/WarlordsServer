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
import { EVENT, WEBSOCKET } from 'src/constants';
import { StateService } from '@State/state.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @SubscribeMessage(WEBSOCKET.PLAYERS.ALL)
  getAllPlayers(): WsResponse<any> {
    //TODO: this is just reporting state, extract to state service?
    return this.buildResponse(WEBSOCKET.PLAYERS.ALL, this.stateService.players);
  }

  @SubscribeMessage(WEBSOCKET.PLAYERS.REQUEST_UPDATE)
  getUpdatedPlayers(@MessageBody('player') player: Player): WsResponse<any> {
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
    this.userService.movePlayer(player, move);
    this.emitToAllPlayers(WEBSOCKET.PLAYERS.UPDATE);
    client.emit(WEBSOCKET.SUCCESS, success);
  }

  @SubscribeMessage(WEBSOCKET.PLAYERS.CONNECT)
  async playerConnected(
    client: any,
    payload: { player: Player; success: any },
  ) {
    const { player, success } = payload;
    this.userService.checkIfPlayerAlreadyConnected(player);
    this.pushPlayerNameToSocketClient(client, player);
    this.logger.log('player connected: ' + client.player);
    await this.userService.playerConnected(player);
    client.emit(WEBSOCKET.PLAYERS.CONNECT);
    client.emit(WEBSOCKET.SUCCESS, success);
    this.emitToAllPlayers(WEBSOCKET.PLAYERS.UPDATE);
  }

  handleDisconnect(client: any) {
    this.logger.log('player disconnected: ' + client.player);
    if (!client.player) return;
    // emit event instead of this
    // emit to state service and remove player there

    this.eventEmitter.emit(EVENT.PLAYER.DISCONNECTED, {
      name: client.player,
    });
    // do this synchronously after removing
    // but i guess we dont have to do this sync since after moving it will be updated?
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
