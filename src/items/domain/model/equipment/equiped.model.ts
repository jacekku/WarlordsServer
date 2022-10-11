import { Item } from '@Items/domain/model/item.model';
import { Prop } from '@nestjs/mongoose';

export class Equiped {
  @Prop()
  public chest: Item = new Item();
  @Prop()
  public legs: Item = new Item();
  @Prop()
  public pauldrons: Item = new Item();
  @Prop()
  public head: Item = new Item();
  @Prop()
  public gauntlets: Item = new Item();
  @Prop()
  public cape: Item = new Item();
  @Prop()
  public shirt: Item = new Item();
  @Prop()
  public boots: Item = new Item();
  @Prop()
  public mainhand: Item = new Item();
  @Prop()
  public offhand: Item = new Item();
  @Prop()
  public trinket: Item = new Item();
  @Prop()
  public ring: Item = new Item();

  public setEquiped(equiped: Equiped) {
    Object.keys(this).forEach((key) => {
      this[key].setItem(equiped[key]);
    });
  }
}
