import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  WsResponse,
  MessageBody,
} from '@nestjs/websockets';
import { TerrainService } from '@Terrain/terrain.service';
import { Player } from 'src/common_model/player.model';
import { Server } from 'socket.io';

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
    if (!player.name) return;
    return {
      event: 'terrain:chunk',
      data: this.terrainService.returnChunksVisibleToPlayer(player, chunks),
    };
  }
}
