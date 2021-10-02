import { Module } from '@nestjs/common';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { StateModule } from 'src/state/state.module';
import { TimerModule } from 'src/timer/timer.module';
import { ItemsController } from './items.controller';
import { ItemsWebsocketGateway } from './items.gateway';
import { ItemsService } from './items.service';

@Module({
  imports: [PersistenceModule, StateModule, TimerModule],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsWebsocketGateway],
  exports: [ItemsService],
})
export class ItemsModule {}
