import { CraftingFacility } from '../../model/inventory/crafting-facility.model';
import * as ITEMS_JSON from './items.json';
import * as FACILITIES_JSON from './crafting-facilities.json';
import { CraftableItem } from 'src/model/inventory/craftable.model';
import { ItemDefinition } from 'src/model/inventory/item-definition.model';
import { EquipmentType } from 'src/model/inventory/equipment-type.model';
import { EquipableItem } from 'src/model/inventory/equipable-item.model';

export class ItemParser {
  items: ItemDefinition[] = [];
  facilities: CraftingFacility[] = [];
  constructor() {
    this.generateCraftingFacilityDefinitions(FACILITIES_JSON);
    this.generateItemDefinitions(ITEMS_JSON);
  }

  findItemByName(name: string) {
    return this.items.find((i) => i.name === name);
  }

  findFacility(name: string) {
    return this.facilities.find((i) => i.name === name);
  }

  generateItemDefinitions(itemsJson) {
    for (const readItem of itemsJson) {
      const newItem = new ItemDefinition();
      newItem.maxStackSize = readItem.maxStackSize;
      newItem.name = readItem.name;
      if (readItem.craftable) {
        newItem.craftable = new CraftableItem();
        newItem.craftable.sourceItems = Array.from(
          readItem.craftable.sourceItems,
        ).map((itemName) => this.findItemByName(itemName as string));
        newItem.craftable.facility = readItem.craftable.facility.map(
          (facilityName) => this.findFacility(facilityName),
        );
        newItem.craftable.result = newItem.name;
      }
      if (readItem.equipable) {
        newItem.equipable = new EquipableItem();
        newItem.equipable.type = readItem.equipable.type;
      }
      this.items.push(newItem);
    }
  }

  generateCraftingFacilityDefinitions(facilitiesJson) {
    for (const readItem of facilitiesJson) {
      const newFacility = new CraftingFacility();
      newFacility.id = readItem.id;
      newFacility.name = readItem.name;
      this.facilities.push(newFacility);
    }
  }
}
