import { Module } from '@nestjs/common';
import { LoggingModule } from 'src/logging/logging.module';
import { StateModule } from 'src/state/state.module';
import { TimerWebsocketGateway } from './timer.gateway';
import { TimerService } from './timer.service';

@Module({
  imports: [LoggingModule, StateModule],
  providers: [TimerService, TimerWebsocketGateway],
  exports: [TimerService],
})
export class TimerModule {}
