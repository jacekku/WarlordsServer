import { BadRequestException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Equiped } from './equipment/equiped.model';
import { EquipmentMap } from './equipment/equipment.map';
import { ItemDefinition } from './item-definition.model';
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

  public isFull(item) {
    if (this.countItems() === this.inventorySize) return true;
    const itemToSet = !!this.findSpaceInStack(item);
    if (itemToSet) return false;
  }
  private initializeInventory() {
    this.items = Array.from({ length: this.inventorySize }, () => null);
  }

  public addItem(item: Item) {
    const index: number = this.findAvailableIndex(item);
    if (index < 0) {
      throw new BadRequestException(
        'Could not find available space in inventory: ' + JSON.stringify(item),
      );
    }
    if (!this.items[index]) {
      this.items[index] = item;
    }
    this.items[index].stackSize = this.items[index].stackSize || 0;
    this.items[index].stackSize += 1;
    return true;
  }
  public removeItem(item: ItemDefinition) {
    const index = this.findItemIndex(item);
    if (index < 0) {
      throw new BadRequestException(
        'Could not find item in inventory: ' + JSON.stringify(item),
      );
    }
    this.items[index].stackSize -= 1;
    if (this.items[index].stackSize <= 0) this.items[index] = null;
    return true;
  }

  equipItem(item: Item) {
    const field = EquipmentMap.itemToEquipment(
      item.equipable.type,
      this.equiped,
    );
    if (field.name) {
      throw new WsException(
        'player has item already equiped on ' + field.equipable.type,
      );
    }
    field.setItem(item);
    return this;
  }

  unequipItem(item: Item) {
    const field = EquipmentMap.itemToEquipment(
      item.equipable.type,
      this.equiped,
    );
    field.setItem(new Item());
    return this;
  }

  private countItems() {
    return this.items.filter(Boolean).length;
  }

  private findSpaceInStack(itemToAdd: ItemDefinition) {
    return this.items
      .filter((item) => Inventory.itemComparator(item, itemToAdd))
      .filter((item) => item.stackSize < item.maxStackSize)[0];
  }

  private findAvailableIndex(itemToAdd: Item) {
    const itemToInsertInto: Item = this.findSpaceInStack(itemToAdd);
    if (itemToInsertInto)
      return this.items.findIndex(
        (item) =>
          Inventory.itemComparator(item, itemToAdd) &&
          item.stackSize === itemToInsertInto.stackSize,
      );
    return this.items.findIndex((item) => item === null);
  }
  private findItemIndex(itemToFind: ItemDefinition) {
    return this.items.findIndex((item) =>
      Inventory.itemComparator(item, itemToFind),
    );
  }

  public findItemByDefinition(itemToFind: ItemDefinition) {
    return this.items.find((item) =>
      Inventory.itemComparator(item, itemToFind),
    );
  }

  public findEquipedItemByDefinition(itemToFind: ItemDefinition) {
    return EquipmentMap.itemToEquipment(
      itemToFind.equipable.type,
      this.equiped,
    );
  }

  public moveItems(sourceIndex, targetIndex) {
    if (sourceIndex < 0 || sourceIndex >= this.inventorySize) return;
    if (targetIndex < 0 || sourceIndex >= this.inventorySize) return;
    if (targetIndex === sourceIndex) return;
    const temp = this.items[sourceIndex];
    this.items[sourceIndex] = this.items[targetIndex];
    this.items[targetIndex] = temp;
  }

  public static wrapInventory(inventory: Inventory) {
    const wrappedInventory = new Inventory();
    wrappedInventory.inventorySize = inventory.inventorySize;
    wrappedInventory.items = inventory.items;
    wrappedInventory.equiped.setEquiped(inventory.equiped);
    return wrappedInventory;
  }

  public static itemComparator(item1: ItemDefinition, item2: ItemDefinition) {
    if (!item1 || !item2) return false;
    return item1.name === item2.name || item1.name === (item2 as any);
  }
}
