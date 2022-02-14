import { Prop } from '@nestjs/mongoose';
import { BuildingDefinition } from './building-definition.model';

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
