import { Prop } from '@nestjs/mongoose';

export class BuildingName {
  @Prop()
  name: string;
}
