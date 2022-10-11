import { Inventory } from '@Common/items/inventory.model';

export class Player {
  playerChunk: number;
  active: boolean;
  id: string;
  inventory: Inventory;
  timers: string[];
  mapId: string;
  name: string;
  x: number;
  y: number;

  constructor(name: string, x: number, y: number) {
    this.name = name;
    this.x = x;
    this.y = y;
  }
}
