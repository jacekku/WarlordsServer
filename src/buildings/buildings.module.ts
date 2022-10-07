import { BuildingsWebsocketGateway } from '@Buildings/buildings.gateway';
import { BuildingsService } from '@Buildings/buildings.service';
import { ItemsModule } from '@Items/items.module';
import { Module } from '@nestjs/common';
import { PersistenceModule } from '@Persistence/persistence.module';
import { StateModule } from '@State/state.module';
import { TimerModule } from '@Timer/timer.module';

@Module({
  imports: [PersistenceModule, StateModule, ItemsModule, TimerModule],
  providers: [BuildingsService, BuildingsWebsocketGateway],
})
export class BuildingsModule {}
