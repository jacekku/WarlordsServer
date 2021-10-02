import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ItemsService } from 'src/items/items.service';
import { ConfigurableLogger } from 'src/logging/logging.service';
import { Player } from 'src/users/model/player.model';
import { BuildingFileService } from 'src/persistence/buildings/buildings-persistence.service';

import { StateService } from 'src/state/state.service';
import { Block } from 'src/terrain/model/block.model';
import { Building } from './model/building.model';

@Injectable()
export class BuildingsService {
  validateAction(player: any, building: any) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    const currentBuilding = this.buildingFileService.getBuilding(
      building,
      this.stateService.terrain.mapId,
    );
    if (currentBuilding.owner.name !== currentPlayer.name) {
      this.logger.error(
        `${player.name} tried to act upon building: ${currentBuilding.id}`,
      );
      throw new WsException('you are not the owner of this building');
    }
  }
  private readonly logger = new ConfigurableLogger(BuildingsService.name);

  constructor(
    private readonly stateService: StateService,
    private readonly buildingFileService: BuildingFileService,
    private readonly itemsService: ItemsService,
  ) {}

  validateCreate(player, building, block, upgrade = false) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);

    const buildingInThisSpace = this.buildingFileService
      .getAllBuildings(this.stateService.terrain.mapId)
      .find((b) => b.x === player.x && b.y === player.y);
    if (!upgrade && buildingInThisSpace) {
      throw new WsException("there's already a building here");
    }
    const buildingDefinition =
      this.stateService.getBuildingDefinition(building);
    if (!buildingDefinition.name) {
      if (upgrade) {
        throw new WsException('cannot upgrade building anymore');
      }
      this.logger.error("couldn't find building " + building.name);
      throw new WsException("couldn't find building " + building.name);
    }
    if (buildingDefinition.level > 1 && !upgrade) {
      throw new WsException('cannot build; upgrade existing building');
    }
    buildingDefinition.buildable.sourceItems.forEach((item) => {
      this.itemsService.playerHasItems(
        currentPlayer,
        item as any,
        item.requiredAmount,
      );
    });
  }

  handleCreate(
    player: Player,
    building: Building,
    block: Block,
    upgrade = false,
  ) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    const currentBlock = this.stateService.findBlock(block);

    const buildingDefinition =
      this.stateService.getBuildingDefinition(building);
    if (buildingDefinition.level > 1 && !upgrade) {
      throw new WsException('cannot build; upgrade existing building');
    }
    const newBuilding = new Building(
      currentBlock.x,
      currentBlock.y,
      currentPlayer,
      buildingDefinition.name,
      buildingDefinition.level,
      building.id,
    );
    newBuilding.buildable = buildingDefinition.buildable;
    newBuilding.craftingFacilities = buildingDefinition.craftingFacilities;
    this.buildingFileService.createBuilding(
      newBuilding,
      this.stateService.terrain.mapId,
    );
    buildingDefinition.buildable.sourceItems.forEach((item) => {
      this.itemsService.removeItem(currentPlayer, item, item.requiredAmount);
    });
  }

  handleRemove(player: Player, building: Building) {
    this.buildingFileService.removeBuilding(
      building,
      this.stateService.terrain.mapId,
    );
  }
  handleUpdate(player: Player, building: Building, block: Block) {
    const buildingDefinition =
      this.stateService.getBuildingDefinition(building);
    this.handleCreate(
      player,
      buildingDefinition.upgrade as Building,
      block,
      true,
    );
    this.handleRemove(player, building);
  }

  handleAction(
    player: Player,
    action: string,
    building: Building,
    block: Block,
  ) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    const currentBuilding = this.buildingFileService.getBuilding(
      building,
      this.stateService.terrain.mapId,
    );
    if (currentBuilding.owner.name !== currentPlayer.name) {
      this.logger.error(
        `${player.name} tried to act upon building: ${currentBuilding.id}`,
      );
      throw new WsException('you are not the owner of this building');
    }
    if (action == 'DEMOLISH') this.handleRemove(currentPlayer, currentBuilding);
    if (action == 'UPGRADE')
      this.handleUpdate(currentPlayer, currentBuilding, block);
  }

  getVisibleBuildings(player: Player) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    return this.buildingFileService.getAllBuildings(
      this.stateService.terrain.mapId,
    );
  }
}
