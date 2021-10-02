import _ from 'lodash';
import { Inventory } from 'src/items/model/inventory.model';

export class Player {
  playerChunk: any;
  active: boolean;
  id: string;
  inventory: Inventory;
  timers: string[];
  constructor(public name: string, public x: number, public y: number) {}
}
