import { CraftableItem } from './crafting/craftable.model';
import { EquipableItem } from './equipment/equipable-item.model';

export class ItemDefinition {
  maxStackSize: number;
  name: string;
  craftable: CraftableItem;
  equipable: EquipableItem;
}
