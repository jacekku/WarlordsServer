import { Module } from '@nestjs/common';
import { StateController } from '@State/state.controller';
import { StateService } from '@State/state.service';

@Module({
  controllers: [StateController],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
