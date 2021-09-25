import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ConfigurableLogger } from 'src/logging/logging.service';
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
  handleCreate(client: any, payload: any) {
    const { player, building, block, success } = payload;
    this.buildingsService.handleCreate(player, building, block);
    client.emit(
      'buildings:requestUpdate',
      this.buildingsService.getVisibleBuildings(player),
    );
    client.emit('success', success);
  }

  @SubscribeMessage('buildings:action')
  handleAction(client: any, payload: any) {
    const { player, action, building, block, success } = payload;
    this.buildingsService.handleAction(player, action, building, block);
    client.emit(
      'buildings:requestUpdate',
      this.buildingsService.getVisibleBuildings(player),
    );
    client.emit('success', success);
  }

  @SubscribeMessage('buildings:requestUpdate')
  handleUpdateRequest(client: any, payload: any) {
    const { player } = payload;
    client.emit(
      'buildings:requestUpdate',
      this.buildingsService.getVisibleBuildings(player),
    );
  }
}
