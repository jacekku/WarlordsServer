import { BuildingDefinition } from '@Buildings/model/building-definition.model';
import { Prop } from '@nestjs/mongoose';

export class Growable {
  @Prop()
  cycleAmount: number;
  @Prop()
  maxGrowth: number;
  @Prop()
  growthStage: number;

  static grow(building: BuildingDefinition) {
    if (!building.growable.growthStage) building.growable.growthStage = 0;
    building.growable.growthStage += 1;
    if (building.growable.growthStage > building.growable.maxGrowth) {
      building.growable.growthStage = building.growable.maxGrowth;
      return false;
    }
    return true;
  }
}
