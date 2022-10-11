import { ItemDefinition } from '@Items/domain/model/item-definition.model';

export class SourceItemDefinition extends ItemDefinition {
  requiredAmount = 1;

  public static fromItem(item: ItemDefinition, requiredAmount = 1) {
    let newItem = new SourceItemDefinition();
    newItem = Object.assign(newItem, item);
    newItem.requiredAmount = requiredAmount;
    return newItem;
  }
}
