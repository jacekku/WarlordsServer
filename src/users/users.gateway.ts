import {
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UsersService } from './users.service';
import { Player } from 'src/model/users/player.model';

@WebSocketGateway({ cors: true })
export class UsersWebsocketGateway implements OnGatewayDisconnect {
  private readonly logger = new Logger(UsersWebsocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly userService: UsersService) {}

  @SubscribeMessage('players:all')
  getAllPlayers(): WsResponse<any> {
    return this.buildResponse(
      'players:all',
      this.userService.getAllConnectedPlayers(),
    );
  }

  @SubscribeMessage('players:requestUpdate')
  getUpdatedPlayers(@MessageBody('player') player: Player): WsResponse<any> {
    const connectedPlayer = this.userService.findConnectedPlayer(player);
    return this.buildResponse(
      'players:requestUpdate',
      this.userService.findVisiblePlayers(connectedPlayer),
    );
  }

  @SubscribeMessage('players:move')
  movePlayer(@MessageBody() data: any) {
    const { player, move } = data;
    this.userService.movePlayer(player, move);
    this.emitToAllPlayers('players:update');
  }

  @SubscribeMessage('players:connect')
  playerConnected(client: any, payload: any) {
    const player = payload.player as Player;
    this.userService.checkIfPlayerAlreadyConnected(player);
    this.pushPlayerNameToSocketClient(client, player);
    this.logger.log('player connected: ' + client.player);
    this.userService.playerConnected(player);
    client.emit('players:connect');
    this.emitToAllPlayers('players:update');
  }

  handleDisconnect(client: any) {
    this.logger.log('player disconnected: ' + client.player);
    if (!client.player) return;
    this.userService.playerDisconnected(client.player);
    this.emitToAllPlayers('players:update');
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
