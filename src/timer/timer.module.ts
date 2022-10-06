import { LoggingModule } from '@Logging/logging.module';
import { Module } from '@nestjs/common';
import { StateModule } from '@State/state.module';
import { TimerWebsocketGateway } from '@Timer/timer.gateway';
import { TimerService } from '@Timer/timer.service';

@Module({
  imports: [LoggingModule, StateModule],
  providers: [TimerService, TimerWebsocketGateway],
  exports: [TimerService],
})
export class TimerModule {}
