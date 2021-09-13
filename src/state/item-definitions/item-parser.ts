import { CraftingFacility } from '../../model/inventory/crafting/crafting-facility.model';
import * as ITEMS_JSON from './items.json';
import * as FACILITIES_JSON from './crafting-facilities.json';
import * as BUILDINGS_JSON from './buildings.json';
import { CraftableItem } from 'src/model/inventory/crafting/craftable.model';
import { ItemDefinition } from 'src/model/inventory/item-definition.model';
import { EquipableItem } from 'src/model/inventory/equipment/equipable-item.model';
import { SourceItemDefinition } from 'src/model/inventory/crafting/source-item-definition.model';
import { Item } from 'src/model/inventory/item.model';
import { BuildingDefinition } from 'src/model/buildings/building-definition.model';
import { Buildable } from 'src/model/buildings/buildable.model';

export class ItemParser {
  items: ItemDefinition[] = [];
  facilities: CraftingFacility[] = [];
  buildings: BuildingDefinition[] = [];
  constructor() {
    this.generateCraftingFacilityDefinitions(FACILITIES_JSON as any);
    this.generateItemDefinitions(ITEMS_JSON as any);
    this.generateBuildingDefinitions(BUILDINGS_JSON as any);
  }

  findItemByName(name: string) {
    return this.items.find((i) => i.name === name);
  }

  findFacility(name: string) {
    return this.facilities.find((i) => i.name === name);
  }

  findBuilding(name: string) {
    return this.buildings.find((i) => i.name === name);
  }

  generateItemDefinitions(itemsJson: Item[]) {
    for (const readItem of itemsJson) {
      const newItem = new ItemDefinition();
      newItem.maxStackSize = readItem.maxStackSize;
      newItem.name = readItem.name;
      if (readItem.craftable) {
        newItem.craftable = new CraftableItem();

        newItem.craftable.sourceItems = Array.from(
          readItem.craftable.sourceItems,
        ).map((item) => {
          if (typeof item === 'string') {
            return SourceItemDefinition.fromItem(this.findItemByName(item));
          }
          if (typeof item === 'object') {
            return SourceItemDefinition.fromItem(
              this.findItemByName((item as any).name),
              (item as any).requiredAmount,
            );
          }
        });
        newItem.craftable.facility = readItem.craftable.facility.map(
          (facilityName) => this.findFacility(facilityName as any),
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

  generateCraftingFacilityDefinitions(facilitiesJson: CraftingFacility[]) {
    for (const readItem of facilitiesJson) {
      const newFacility = new CraftingFacility();
      newFacility.name = readItem.name;
      this.facilities.push(newFacility);
    }
  }

  generateBuildingDefinitions(buildingsJson: BuildingDefinition[]) {
    for (const readBuilding of buildingsJson) {
      const building = new BuildingDefinition();
      building.buildable = new Buildable();
      building.name = readBuilding.name;
      building.buildable.sourceItems = Array.from(
        readBuilding.buildable.sourceItems,
      ).map((item) => {
        if (typeof item === 'string') {
          return SourceItemDefinition.fromItem(this.findItemByName(item));
        }
        if (typeof item === 'object') {
          return SourceItemDefinition.fromItem(
            this.findItemByName((item as any).name),
            (item as any).requiredAmount,
          );
        }
      });

      if (readBuilding.craftingFacilities) {
        building.craftingFacilities = [];
        const facilities = readBuilding.craftingFacilities;
        facilities.forEach((facilityName) => {
          const facility = this.findFacility(facilityName as any);
          if (!facility) return;
          building.craftingFacilities.push(facility);
        });
      }
      this.buildings.push(building);
    }
  }
}
