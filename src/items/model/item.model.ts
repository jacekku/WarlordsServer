import { ItemDefinition } from './item-definition.model';

export class Item extends ItemDefinition {
  public stackSize = 0;
  public index: number;

  public validateStackSize(newStackSize: number) {
    return newStackSize <= this.maxStackSize;
  }

  public setItem(item: Item) {
    for (const prop of Object.keys(this)) {
      delete this[prop];
    }
    Object.assign(this, item);
  }
}
