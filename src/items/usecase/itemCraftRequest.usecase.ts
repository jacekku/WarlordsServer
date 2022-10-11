import { ItemsService } from '@Items/items.service';
import {
  ItemCraftRequest,
  ItemCraftEvent,
} from '@Items/ports/itemCraftRequest.port';
import { Inject, Injectable } from '@nestjs/common';
import { EVENT } from 'src/constants';
import { EventBus } from 'src/infrastructure/eventBus.port';

@Injectable()
export class ItemCraftRequestUseCase implements ItemCraftRequest {
  constructor(
    private readonly itemsService: ItemsService,
    @Inject(EventBus) private readonly eventBus: EventBus,
  ) {}

  execute(event: ItemCraftEvent) {
    try {
      this.itemsService.validateCraftItem(event.player, event.itemToCraft);
    } catch (e) {
      console.log(e);
    }
    this.eventBus.emitAsync(EVENT.ITEMS.CRAFT_VALIDATED, event);
  }
}
