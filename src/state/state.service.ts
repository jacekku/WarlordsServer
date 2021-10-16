import { Injectable } from '@nestjs/common';
import { BuildingDefinition } from 'src/buildings/model/building-definition.model';
import { Building } from 'src/buildings/model/building.model';
import { CraftingFacility } from 'src/items/model/crafting/crafting-facility.model';
import { Inventory } from 'src/items/model/inventory.model';
import { ItemDefinition } from 'src/items/model/item-definition.model';
import { Block } from 'src/terrain/model/block.model';
import { Terrain } from 'src/terrain/model/terrain.model';
import { Utilities } from 'src/terrain/utilities/utilities.service';
import { Player } from 'src/users/model/player.model';
import { ItemParser } from './item-definitions/item-parser';

@Injectable()
export class StateService {
  public terrain: Terrain;
  public players: Player[];
  public buildings: Building[];
  public readonly itemDefinitions: ItemDefinition[];
  public readonly facilitiesDefinitions: CraftingFacility[];
  public readonly buildingDefinitions: BuildingDefinition[];

  public notifyList: Map<string, CallableFunction[]>;

  constructor() {
    const itemParser = new ItemParser();
    this.itemDefinitions = itemParser.items;
    this.facilitiesDefinitions = itemParser.facilities;
    this.buildingDefinitions = itemParser.buildings;

    this.buildings = [];

    this.notifyList = new Map();
    this.notifyList.set('buildingUpdate', []);
    this.notifyList.set('playerUpdate', []);
    this.notifyList.set('terrainUpdate', []);
  }
  saveBuildings() {
    console.log('saveBuildings not set');
  }

  updateBuilding(building: Building, remove = false) {
    const buildingIndex = this.buildings.findIndex(
      (bld) => building.id === bld.id,
    );
    if (buildingIndex < 0) {
      this.buildings.push(building);
      return;
    }
    if (remove) {
      delete this.buildings[buildingIndex];
      this.buildings = this.buildings.filter(Boolean);
    } else {
      this.buildings[buildingIndex] = building;
    }
    this.notifyList.get('buildingUpdate').forEach((callback) => callback());
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

  getAllPlayers() {
    return this.players;
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
