import { Item } from '@Common/items/item.model';
import { Player } from '@Common/player.model';

export class ItemCraftEvent {
  player: Player;
  itemToCraft: Item;
}

export abstract class ItemCraftRequest {
  abstract execute(event: ItemCraftEvent);
}
