import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Character {
  uid: string;
  @Prop()
  characterName: string;
  @Prop()
  mapId: string;
}
