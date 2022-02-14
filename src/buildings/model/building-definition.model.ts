import { Prop } from '@nestjs/mongoose';
import { CraftingFacility } from 'src/items/model/crafting/crafting-facility.model';
import { Buildable } from './buildable.model';
import { BuildingName } from './building-name.model';
import { Growable } from './growable.model';

export class BuildingDefinition extends BuildingName {
  @Prop()
  buildable: Buildable;
  @Prop()
  craftingFacilities: CraftingFacility[];
  @Prop()
  upgrade: BuildingName;
  @Prop()
  level: number;
  @Prop()
  growable: Growable;

  public static comparator(building1: BuildingName, building2: BuildingName) {
    if (!building1 || !building2) return false;
    return (
      building1.name === building2.name || building1.name === (building2 as any)
    );
  }
}
