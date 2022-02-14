import { Prop } from '@nestjs/mongoose';
import { CraftableItem } from './crafting/craftable.model';
import { EquipableItem } from './equipment/equipable-item.model';

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
