import {
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from './users.service';
import { Player } from 'src/users/model/player.model';
import { ConfigurableLogger } from 'src/logging/logging.service';
import { WEBSOCKET } from 'src/constants';

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

  constructor(private readonly userService: UsersService) {}

  @SubscribeMessage(WEBSOCKET.PLAYERS.ALL)
  getAllPlayers(): WsResponse<any> {
    return this.buildResponse(
      WEBSOCKET.PLAYERS.ALL,
      this.userService.getAllConnectedPlayers(),
    );
  }

  @SubscribeMessage(WEBSOCKET.PLAYERS.REQUEST_UPDATE)
  getUpdatedPlayers(@MessageBody('player') player: Player): WsResponse<any> {
    const connectedPlayer = this.userService.findConnectedPlayer(player);
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
    this.userService.playerDisconnected(client.player);
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
