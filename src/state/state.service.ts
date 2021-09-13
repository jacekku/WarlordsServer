import { Injectable } from '@nestjs/common';
import { Player } from 'src/model/users/player.model';
import { Terrain } from 'src/model/terrain/terrain.model';
import { CraftingFacility } from 'src/model/inventory/crafting/crafting-facility.model';
import { ItemParser } from './item-definitions/item-parser';
import { Inventory } from 'src/model/inventory/inventory.model';
import { ItemDefinition } from 'src/model/inventory/item-definition.model';
import { Block } from 'src/model/terrain/block.model';
import { Utilities } from 'src/terrain/utilities/utilities.service';
import { Building } from 'src/model/buildings/building.model';
import { BuildingDefinition } from 'src/model/buildings/building-definition.model';

@Injectable()
export class StateService {
  public terrain: Terrain;
  public players: Player[];
  public buildings: Building[];
  public readonly itemDefinitions: ItemDefinition[];
  public readonly facilitiesDefinitions: CraftingFacility[];
  public readonly buildingDefinitions: BuildingDefinition[];

  constructor() {
    const itemParser = new ItemParser();
    this.itemDefinitions = itemParser.items;
    this.facilitiesDefinitions = itemParser.facilities;
    this.buildingDefinitions = itemParser.buildings;
  }

  getState() {
    return {
      terrain: this.terrain,
      players: this.players,
      buildings: this.buildings,
    };
  }

  getDefinitions() {
    return {
      itemDefinitions: this.itemDefinitions,
      facilitiesDefinitions: this.facilitiesDefinitions,
      buildingDefinitions: this.buildingDefinitions,
    };
  }

  getItemDefinition(item: ItemDefinition) {
    const itemDefinition = this.itemDefinitions.find((i) =>
      Inventory.itemComparator(item, i),
    );
    return Object.assign({}, itemDefinition);
  }

  getBuildingDefinition(building: BuildingDefinition) {
    const buildingDefinition = this.buildingDefinitions.find((i) =>
      BuildingDefinition.comparator(building, i),
    );
    return Object.assign({}, buildingDefinition);
  }

  itemExists(item: ItemDefinition) {
    return this.itemDefinitions.find((i) => Inventory.itemComparator(i, item));
  }

  findConnectedPlayer(playerToFind: Player) {
    return this.players.find((player) => player.name === playerToFind.name);
  }

  updatePlayer(player: Player) {
    const playerIndex = this.players.findIndex((p) => player.name === p.name);
    if (playerIndex < 0) {
      return;
    }
    const currentPlayer = this.players[playerIndex];
    this.players[playerIndex] = Object.assign(currentPlayer, player);
  }
  findBlock(block: Block) {
    const chunkSize = this.terrain.chunkSize;
    const chunkIndex = Utilities.getIndex(
      (Math.floor(block.x / chunkSize) * chunkSize) / chunkSize,
      (Math.floor(block.y / chunkSize) * chunkSize) / chunkSize,
      this.terrain.width / this.terrain.chunkSize,
    );
    return this.terrain.chunks[chunkIndex].blocks[block.id];
  }
}
