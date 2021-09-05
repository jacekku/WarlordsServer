import { CraftingFacility } from './crafting-facility.model';
import { CraftingSourceItemDefinition } from './crafting-source-item-definition.model';

export class CraftableItem {
  result: string;
  sourceItems: CraftingSourceItemDefinition[];
  facility: CraftingFacility[];

  toJSON() {
    return {
      result: this.result,
      sourceItems: this.sourceItems.map((i) => {
        return { name: i.name, requiredAmount: i.requiredAmount };
      }),
      facility: this.facility.map((i) => i.name),
    };
  }
}
