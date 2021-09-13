import { Utilities } from 'src/terrain/utilities/utilities.service';
import { Player } from '../users/player.model';
import { BuildingDefinition } from './building-definition.model';

export class Building extends BuildingDefinition {
  x: number;
  y: number;
  owner: Player;
  id: string;
  level: number;

  constructor(x, y, owner, name, level = 1) {
    super();
    this.x = x;
    this.y = y;
    this.owner = { name: owner.name } as any;
    this.name = name;
    this.level = level;
    this.id = Utilities.generateStringId();
  }
}
