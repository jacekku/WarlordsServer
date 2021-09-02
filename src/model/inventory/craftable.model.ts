import { CraftingFacility } from './crafting-facility.model';
import { ItemDefinition } from './item-definition.model';

export class CraftableItem {
  result: string;
  sourceItems: ItemDefinition[];
  facility: CraftingFacility[];

  toJSON() {
    return {
      result: this.result,
      sourceItems: this.sourceItems.map((i) => i.name),
      facility: this.facility.map((i) => i.name),
    };
  }
}
