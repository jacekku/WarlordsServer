import { Inventory } from '../inventory/inventory.model';

export class Player {
  playerChunk: any;
  active: boolean;
  id: string;
  inventory: Inventory;
  constructor(public name: string, public x: number, public y: number) {}
}
