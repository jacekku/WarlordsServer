import { BadRequestException, ConflictException } from '@nestjs/common';
import _ from 'lodash';
import { Equiped } from './equiped.model';
import { Item } from './item.model';

export class Inventory {
  public equiped: Equiped;
  public items: Item[];
  public inventorySize: number;
  public uid: number;

  constructor(inventorySize = 16) {
    this.inventorySize = inventorySize;
    this.initializeInventory();
    this.equiped = new Equiped();
  }

  public isFull() {
    return this.countItems() === this.inventorySize;
  }
  private initializeInventory() {
    this.items = Array.from({ length: this.inventorySize }, () => null);
  }

  public addItem(item: Item) {
    const index: number = this.findAvailableIndex();
    if (index < 0) {
      throw new BadRequestException(
        'Could not find available space in inventory: ' + JSON.stringify(item),
      );
    }
    this.items[index] = item;
    return true;
  }
  public removeItem(item: Item) {
    const index = this.findItemIndex(item);
    if (index < 0) {
      throw new BadRequestException(
        'Could not find item in inventory: ' + JSON.stringify(item),
      );
    }
    this.items[index] = null;
    return true;
  }

  private countItems() {
    return this.items.filter(Boolean).length;
  }

  private findAvailableIndex() {
    return this.items.findIndex((item) => item === null);
  }
  private findItemIndex(itemToFind: Item) {
    return this.items.findIndex((item) => item.uid === itemToFind.uid);
  }

  public static wrapInventory(inventory: Inventory) {
    const wrappedInventory = new Inventory();
    wrappedInventory.inventorySize = inventory.inventorySize;
    wrappedInventory.items = inventory.items;
    wrappedInventory.equiped = inventory.equiped;
    return wrappedInventory;
  }
}
