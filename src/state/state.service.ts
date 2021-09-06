import { Injectable } from '@nestjs/common';
import { Player } from 'src/model/users/player.model';
import { Terrain } from 'src/model/terrain/terrain.model';
import { CraftingFacility } from 'src/model/inventory/crafting/crafting-facility.model';
import { Item } from 'src/model/inventory/item.model';
import { ItemParser } from './item-definitions/item-parser';
import { Inventory } from 'src/model/inventory/inventory.model';
import { ItemDefinition } from 'src/model/inventory/item-definition.model';

@Injectable()
export class StateService {
  public terrain: Terrain;
  public players: Player[];
  public readonly itemDefinitions: ItemDefinition[];
  public readonly facilitiesDefinitions: CraftingFacility[];

  constructor() {
    const itemParser = new ItemParser();
    this.itemDefinitions = itemParser.items;
    this.facilitiesDefinitions = itemParser.facilities;
  }

  getState() {
    return {
      terrain: this.terrain,
      players: this.players,
    };
  }

  getDefinitions() {
    return {
      itemDefinitions: this.itemDefinitions,
      facilitiesDefinitions: this.facilitiesDefinitions,
    };
  }

  getItemDefinition(item: ItemDefinition) {
    const itemDefinition = this.itemDefinitions.find((i) =>
      Inventory.itemComparator(item, i),
    );
    return Object.assign({}, itemDefinition);
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
}
