import { ItemsEventListener } from '@Items/adapters/api/items.events';
import { ItemCraft } from '@Items/ports/itemCraft.port';
import { ItemCraftFinished } from '@Items/ports/itemCraftFinished.port';
import { ItemCraftRequest } from '@Items/ports/itemCraftRequest.port';
import { ItemCraftUseCase } from '@Items/usecase/itemCraft.usecase';
import { ItemCraftFinishedUseCase } from '@Items/usecase/itemCraftFinished.usecase';
import { ItemCraftRequestUseCase } from '@Items/usecase/itemCraftRequest.usecase';
import { Module } from '@nestjs/common';
import { EventBus } from 'src/infrastructure/eventBus.port';
import { EventEmitterBus } from 'src/infrastructure/eventEmitter.adapter';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { StateModule } from 'src/state/state.module';
import { TimerModule } from 'src/timer/timer.module';
import { ItemsController } from './adapters/api/items.controller';
import { ItemsWebsocketGateway } from './adapters/api/items.gateway';
import { ItemsService } from './items.service';

@Module({
  imports: [PersistenceModule, StateModule, TimerModule],
  controllers: [ItemsController],
  providers: [
    ItemsService,
    ItemsWebsocketGateway,
    ItemsEventListener,
    {
      provide: ItemCraftRequest,
      useClass: ItemCraftRequestUseCase,
    },
    {
      provide: ItemCraft,
      useClass: ItemCraftUseCase,
    },
    {
      provide: ItemCraftFinished,
      useClass: ItemCraftFinishedUseCase,
    },
    { provide: EventBus, useClass: EventEmitterBus },
  ],
  exports: [ItemsService],
})
export class ItemsModule {}
