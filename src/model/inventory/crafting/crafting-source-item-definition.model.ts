import { ItemDefinition } from '../item-definition.model';

export class CraftingSourceItemDefinition extends ItemDefinition {
  requiredAmount = 1;

  public static fromItem(item: ItemDefinition, requiredAmount = 1) {
    let newItem = new CraftingSourceItemDefinition();
    newItem = Object.assign(newItem, item);
    newItem.requiredAmount = requiredAmount;
    return newItem;
  }
}
