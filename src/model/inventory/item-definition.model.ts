import _ from 'lodash';
import { CraftableItem } from './craftable.model';
import { EquipmentType } from './equipment-type.model';

export class ItemDefinition {
  maxStackSize: number;
  name: string;
  craftable: CraftableItem;
  equipment: EquipmentType;
}
