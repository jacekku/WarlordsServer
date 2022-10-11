import { ItemCraftEvent } from '@Items/ports/itemCraftRequest.port';

export abstract class ItemCraft {
  abstract execute(event: ItemCraftEvent);
}
