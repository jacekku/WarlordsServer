import { Buildable } from '@Buildings/model/buildable.model';
import { BuildingName } from '@Buildings/model/building-name.model';
import { Growable } from '@Buildings/model/growable.model';
import { CraftingFacility } from '@Common/items/crafting-facility.model';
import { Prop } from '@nestjs/mongoose';

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
