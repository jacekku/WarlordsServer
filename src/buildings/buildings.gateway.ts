import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ItemsService } from 'src/items/items.service';
import { ConfigurableLogger } from 'src/logging/logging.service';
import { Building } from 'src/model/buildings/building.model';
import { Block } from 'src/model/terrain/block.model';
import { Player } from 'src/model/users/player.model';
import { BuildingsService } from './buildings.service';

@WebSocketGateway({
  cors: {
    origin: (host: string, callback) => {
      callback(null, process.env.CORS_ORIGIN.split(','));
    },
  },
})
export class BuildingsWebsocketGateway {
  private readonly logger = new ConfigurableLogger(
    BuildingsWebsocketGateway.name,
  );

  constructor(public readonly buildingsService: BuildingsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('buildings:create')
  handleCreate(
    @MessageBody('player') player: Player,
    @MessageBody('building') building: Building,
    @MessageBody('block') block: Block,
  ): WsResponse<any> {
    this.buildingsService.handleCreate(player, building, block);
    return this.buildResponse(
      this.buildingsService.getVisibleBuildings(player),
    );
  }

  @SubscribeMessage('buildings:action')
  handleAction(
    @MessageBody('player') player: Player,
    @MessageBody('action') action: string,
    @MessageBody('building') building: Building,
  ): WsResponse<any> {
    this.buildingsService.handleAction(player, action, building);
    return this.buildResponse(
      this.buildingsService.getVisibleBuildings(player),
    );
  }

  @SubscribeMessage('buildings:requestUpdate')
  handleUpdateRequest(@MessageBody('player') player: Player): WsResponse<any> {
    return this.buildResponse(
      this.buildingsService.getVisibleBuildings(player),
    );
  }

  buildResponse(data, event = 'buildings:requestUpdate'): WsResponse<any> {
    return { event, data };
  }
}
