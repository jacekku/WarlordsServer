import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Character {
  @Prop()
  uid: string;
  @Prop()
  characterName: string;
  @Prop()
  mapId: string;
}
