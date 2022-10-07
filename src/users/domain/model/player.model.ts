import { Inventory } from '@Items/model/inventory.model';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Player {
  @Prop()
  playerChunk: number;
  @Prop()
  active: boolean;
  @Prop()
  id: string;
  @Prop()
  inventory: Inventory;
  @Prop()
  timers: string[];
  @Prop()
  mapId: string;
  @Prop()
  name: string;
  @Prop()
  x: number;
  @Prop()
  y: number;

  constructor(name: string, x: number, y: number) {
    this.name = name;
    this.x = x;
    this.y = y;
  }
}
