import {
  WsResponse,
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TerrainService } from './terrain.service';
import { Player } from 'src/users/model/player.model';

@WebSocketGateway({
  cors: {
    origin: (host: string, callback) => {
      callback(null, process.env.CORS_ORIGIN.split(','));
    },
  },
})
export class TerrainWebsocketGateway {
  constructor(private readonly terrainService: TerrainService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('terrain:info')
  getTerrainInfo(): WsResponse<any> {
    return { event: 'terrain:info', data: this.terrainService.getMapInfo() };
  }

  @SubscribeMessage('terrain:chunk')
  getChunk(
    @MessageBody('player') player: Player,
    @MessageBody('chunks') chunks: number[],
  ): WsResponse<any> {
    return {
      event: 'terrain:chunk',
      data: this.terrainService.returnChunksVisibleToPlayer(player, chunks),
    };
  }
}
