import { ItemsService } from '@Items/items.service';
import { ItemCraft } from '@Items/ports/itemCraft.port';
import { ItemCraftEvent } from '@Items/ports/itemCraftRequest.port';
import { Inject, Injectable } from '@nestjs/common';
import { EVENT } from 'src/constants';
import { EventBus } from 'src/infrastructure/eventBus.port';

@Injectable()
export class ItemCraftUseCase implements ItemCraft {
  constructor(
    private readonly itemService: ItemsService,
    @Inject(EventBus) private readonly eventBus: EventBus,
  ) {}
  execute(event: ItemCraftEvent) {
    this.itemService.craftItem(event.player, event.itemToCraft);
    this.eventBus.emitAsync(EVENT.ITEMS.CRAFT_FINISHED, event);
  }
}
