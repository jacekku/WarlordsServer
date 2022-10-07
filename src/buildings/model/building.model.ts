import { BuildingDefinition } from '@Buildings/model/building-definition.model';
import { Prop, Schema } from '@nestjs/mongoose';
import { Utilities } from '@Terrain/utilities/utilities.service';
import { Player } from '@Users/model/player.model';

@Schema()
export class Building extends BuildingDefinition {
  @Prop()
  x: number;
  @Prop()
  y: number;
  @Prop()
  owner: Player;
  @Prop()
  id: string;
  @Prop()
  mapId: string;

  constructor(x, y, owner, name, level = 1, id = Utilities.generateStringId()) {
    super();
    this.x = x;
    this.y = y;
    this.owner = { name: owner.name } as any;
    this.name = name;
    this.level = level;
    this.id = id;
  }
  static from(json) {
    return Object.assign(new BuildingDefinition(), json);
  }
}
