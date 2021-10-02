import { CraftingFacility } from './crafting-facility.model';
import { SourceItemDefinition } from './source-item-definition.model';

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
