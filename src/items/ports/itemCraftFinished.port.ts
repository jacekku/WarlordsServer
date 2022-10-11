import { ItemCraftEvent } from '@Items/ports/itemCraftRequest.port';

export abstract class ItemCraftFinished {
  abstract execute(event: ItemCraftEvent);
}
