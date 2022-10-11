import { Prop } from '@nestjs/mongoose';

export class CraftingFacility {
  @Prop()
  name: string;
}
