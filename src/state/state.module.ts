import { Module } from '@nestjs/common';
import { StateController } from '@State/state.controller';
import { StateEventListener } from '@State/state.events';
import { StateService } from '@State/state.service';

@Module({
  controllers: [StateController],
  providers: [StateService, StateEventListener],
  exports: [StateService],
})
export class StateModule {}
