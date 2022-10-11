import { ItemDefinition } from '@Common/items/item-definition.model';
import { Prop } from '@nestjs/mongoose';

export class SourceItemDefinition extends ItemDefinition {
  @Prop([Number])
  requiredAmount = 1;

  public static fromItem(item: ItemDefinition, requiredAmount = 1) {
    let newItem = new SourceItemDefinition();
    newItem = Object.assign(newItem, item);
    newItem.requiredAmount = requiredAmount;
    return newItem;
  }
}
