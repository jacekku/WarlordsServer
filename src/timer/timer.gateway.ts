import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { TimerService } from './timer.service';

@WebSocketGateway({
  cors: {
    origin: (host: string, callback) => {
      callback(null, process.env.CORS_ORIGIN.split(','));
    },
  },
})
export class TimerWebsocketGateway implements OnGatewayInit {
  constructor(private readonly timerService: TimerService) {}

  afterInit(server: any) {
    this.timerService.websocketServer = server;
  }

  @SubscribeMessage('timer:ack')
  acknowledgeTimer(client: any, payload: any) {
    const [timerId, ackType, playerName] = payload;
    this.timerService.ackTimer(timerId, ackType, playerName);
  }

  @SubscribeMessage('timer:cancel')
  cancelTimer(client: any, payload: any) {
    const { timer } = payload;
    this.timerService.cancelTimer(timer);
  }
}
