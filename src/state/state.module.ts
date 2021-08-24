import { Module } from '@nestjs/common';
import { StateController } from './state.controller';
import { StateService } from './state.service';

@Module({
  controllers: [StateController],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
