import { CraftingFacility } from '../inventory/crafting/crafting-facility.model';
import { Buildable } from './buildable.model';

export class BuildingDefinition {
  name: string;
  buildable: Buildable;
  craftingFacilities: CraftingFacility[];
  upgrade: BuildingDefinition;
  level: number;

  public static comparator(
    building1: BuildingDefinition,
    building2: BuildingDefinition,
  ) {
    if (!building1 || !building2) return false;
    return (
      building1.name === building2.name || building1.name === (building2 as any)
    );
  }
}
