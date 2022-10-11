import { CraftingFacility } from '@Common/items/crafting-facility.model';
import { SourceItemDefinition } from '@Common/items/source-item-definition.model';

export class CraftableItem {
  result: string;
  sourceItems: SourceItemDefinition[];
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
