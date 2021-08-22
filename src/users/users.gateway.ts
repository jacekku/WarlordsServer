import {
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { UsersService } from './users.service';
import { Player } from 'src/model/player.model';

@WebSocketGateway({ cors: true })
export class UsersWebsocketGateway implements OnGatewayDisconnect {
  private readonly logger = new Logger(UsersWebsocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly userService: UsersService) {}

  @SubscribeMessage('players:all')
  getAllPlayers(@MessageBody() data: any): WsResponse<any> {
    this.logger.debug(data, this.getAllPlayers.name);
    return this.buildResponse(
      'players:all',
      this.userService.getAllConnectedPlayers(),
    );
  }

  @SubscribeMessage('players:move')
  movePlayer(@MessageBody() data: any): WsResponse<any> {
    this.logger.debug(this.movePlayer.name, data);
    const { player, move } = data;
    return this.buildResponse(
      'players:move',
      this.userService.movePlayer(player, move),
    );
  }

  @SubscribeMessage('players:connect')
  playerConnected(client: any, payload: any): WsResponse<any> {
    const player = payload.player as Player;
    this.pushPlayerNameToSocketClient(client, player);
    this.logger.debug(this.playerConnected.name, player);
    return this.buildResponse(
      'players:connect',
      this.userService.playerConnected(player),
    );
  }

  handleDisconnect(client: any) {
    this.logger.debug(this.handleDisconnect.name, client.player);
    this.userService.playerDisconnected(client.player);
  }

  buildResponse(event: string, data: any): WsResponse<any> {
    return { event, data };
  }

  pushPlayerNameToSocketClient(client: any, player: Player) {
    client.player = player.name;
  }
}
