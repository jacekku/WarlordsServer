import { Item } from '../item.model';

export class Equiped {
  public chest: Item = new Item();
  public legs: Item = new Item();
  public pauldrons: Item = new Item();
  public head: Item = new Item();
  public gauntlets: Item = new Item();
  public cape: Item = new Item();
  public shirt: Item = new Item();
  public boots: Item = new Item();
  public mainhand: Item = new Item();
  public offhand: Item = new Item();
  public trinket: Item = new Item();
  public ring: Item = new Item();

  public setEquiped(equiped: Equiped) {
    Object.keys(this).forEach((key) => {
      this[key].setItem(equiped[key]);
    });
  }
}
