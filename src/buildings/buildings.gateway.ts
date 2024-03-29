import { BuildingsService } from '@Buildings/buildings.service';
import { ConfigurableLogger } from '@Logging/logging.service';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { TimerService } from '@Timer/timer.service';

@WebSocketGateway({
  cors: {
    origin: (host: string, callback) => {
      callback(null, process.env.CORS_ORIGIN.split(','));
    },
  },
})
export class BuildingsWebsocketGateway implements OnGatewayInit {
  private readonly logger = new ConfigurableLogger(
    BuildingsWebsocketGateway.name,
  );

  constructor(
    public readonly buildingsService: BuildingsService,
    private readonly timerService: TimerService,
  ) {}

  afterInit(server: any) {
    this.buildingsService.websocketServer = server;
  }

  @SubscribeMessage('buildings:create')
  async handleCreate(client: any, payload: any) {
    const { player, building, block, success } = payload;
    await this.buildingsService.validateCreate(player, building, block);
    const callback = () => {
      this.buildingsService.handleCreate(player, building, block);
      client.emit(
        'buildings:requestUpdate',
        this.buildingsService.getVisibleBuildings(player),
      );
      client.emit('success', success);
    };
    const timer = this.timerService.addTimer(player, 'BUILD', callback);
    client.emit('timer', timer);
  }

  @SubscribeMessage('buildings:action')
  async handleAction(client: any, payload: any) {
    const { player, action, building, block, success } = payload;
    await this.buildingsService.validateAction(player, building);
    if (action == 'UPGRADE') {
      this.buildingsService.validateCreate(player, building, block, true);
    }
    const callback = () => {
      this.buildingsService.handleAction(player, action, building, block);
      client.emit(
        'buildings:requestUpdate',
        this.buildingsService.getVisibleBuildings(player),
      );
      client.emit('success', success);
    };
    const timer = this.timerService.addTimer(player, action, callback);
    client.emit('timer', timer);
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
