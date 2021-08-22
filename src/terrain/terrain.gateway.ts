import {
  WsResponse,
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { TerrainService } from './terrain.service';

@WebSocketGateway({ cors: true })
export class TerrainWebsocketGateway {
  private readonly logger = new Logger(TerrainWebsocketGateway.name);

  constructor(private readonly terrainService: TerrainService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('terrain:info')
  getTerrainInfo(@MessageBody() data): WsResponse<any> {
    this.logger.debug(data, this.getTerrainInfo.name);
    return { event: 'terrain:info', data: this.terrainService.getMapInfo() };
  }

  @SubscribeMessage('terrain:chunk')
  getChunk(@MessageBody('chunkId') chunkId: number): WsResponse<any> {
    this.logger.debug(chunkId, this.getChunk.name);
    return {
      event: 'terrain:info',
      data: this.terrainService.getChunk(chunkId),
    };
  }
}
