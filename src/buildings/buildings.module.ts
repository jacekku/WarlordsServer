import { Module } from '@nestjs/common';
import { ItemsModule } from 'src/items/items.module';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { StateModule } from 'src/state/state.module';
import { TimerModule } from 'src/timer/timer.module';
import { BuildingsWebsocketGateway } from './buildings.gateway';
import { BuildingsService } from './buildings.service';
@Module({
  imports: [PersistenceModule, StateModule, ItemsModule, TimerModule],
  providers: [BuildingsService, BuildingsWebsocketGateway],
})
export class BuildingsModule {}
