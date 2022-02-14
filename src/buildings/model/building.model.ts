import { Prop, Schema } from '@nestjs/mongoose';
import { Utilities } from 'src/terrain/utilities/utilities.service';
import { Player } from 'src/users/model/player.model';
import { BuildingDefinition } from './building-definition.model';

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
