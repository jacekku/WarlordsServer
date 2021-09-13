import { Module } from '@nestjs/common';
import { ItemsModule } from 'src/items/items.module';
import { ItemsService } from 'src/items/items.service';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { StateModule } from 'src/state/state.module';
import { BuildingsWebsocketGateway } from './buildings.gateway';
import { BuildingsService } from './buildings.service';
@Module({
  imports: [PersistenceModule, StateModule, ItemsModule],
  providers: [BuildingsService, BuildingsWebsocketGateway],
})
export class BuildingsModule {}
