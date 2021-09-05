import { CraftableItem } from './craftable.model';
import { EquipableItem } from './equipable-item.model';

export class ItemDefinition {
  maxStackSize: number;
  name: string;
  craftable: CraftableItem;
  equipable: EquipableItem;
}
