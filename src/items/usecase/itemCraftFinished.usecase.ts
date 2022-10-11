import { ItemsWebsocketGateway } from '@Items/adapters/api/items.gateway';
import { ItemsService } from '@Items/items.service';
import { ItemCraftFinished } from '@Items/ports/itemCraftFinished.port';
import { ItemCraftEvent } from '@Items/ports/itemCraftRequest.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemCraftFinishedUseCase implements ItemCraftFinished {
  constructor(
    private readonly itemsGateway: ItemsWebsocketGateway,
    private readonly itemsService: ItemsService,
  ) {}

  execute(event: ItemCraftEvent) {
    const inventory = this.itemsService.getInventory(event.player);
    this.itemsGateway.itemCraftFinished(event.player, inventory);
  }
}
