import { EquipableItem } from '@Common/items/equipable-item.model';
import { CraftableItem } from '@Items/domain/model/crafting/craftable.model';
import { Prop } from '@nestjs/mongoose';

export class ItemDefinition {
  @Prop()
  maxStackSize: number;
  @Prop()
  name: string;
  @Prop()
  craftable: CraftableItem;
  @Prop()
  equipable: EquipableItem;
}
