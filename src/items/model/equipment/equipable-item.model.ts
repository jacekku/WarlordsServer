import { Prop } from '@nestjs/mongoose';
import { EquipmentType } from './equipment-type.model';

export class EquipableItem {
  @Prop({ enum: EquipmentType })
  type: EquipmentType;
}
