import {
  WsResponse,
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TerrainService } from './terrain.service';
import { Player } from 'src/model/users/player.model';

@WebSocketGateway({ cors: true })
export class TerrainWebsocketGateway {
  constructor(private readonly terrainService: TerrainService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('terrain:info')
  getTerrainInfo(): WsResponse<any> {
    return { event: 'terrain:info', data: this.terrainService.getMapInfo() };
  }

  @SubscribeMessage('terrain:chunk')
  getChunk(@MessageBody('player') player: Player): WsResponse<any> {
    return {
      event: 'terrain:chunk',
      data: this.terrainService.returnChunksVisibleToPlayer(player),
    };
  }
}
