import {
  BeforeApplicationShutdown,
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { Server } from 'socket.io';

import { WsException } from '@nestjs/websockets';
import { ItemsService } from 'src/items/items.service';
import { ConfigurableLogger } from 'src/logging/logging.service';
import { StateService } from 'src/state/state.service';
import { Block } from 'src/terrain/model/block.model';
import { Timer } from 'src/timer/model/timer.model';
import { TimerService } from 'src/timer/timer.service';
import { Player } from 'src/users/model/player.model';
import { Building } from './model/building.model';
import { Growable } from './model/growable.model';
import { IBuildingsPersistence } from 'src/persistence/buildings/interfaces/buildings-persistence-interface.model';
import { BUILDINGS_PERSISTENCE_SERVICE } from 'src/constants';

@Injectable()
export class BuildingsService
  implements BeforeApplicationShutdown, OnApplicationBootstrap, OnModuleInit
{
  websocketServer: Server;
  private readonly logger = new ConfigurableLogger(BuildingsService.name);
  constructor(
    private readonly stateService: StateService,
    @Inject(BUILDINGS_PERSISTENCE_SERVICE)
    private readonly buildingPersistenceService: IBuildingsPersistence,
    private readonly itemsService: ItemsService,
    private readonly timerService: TimerService,
  ) {}

  onModuleInit() {
    this.stateService.saveBuildings = this.saveBuildings.bind(this);
    this.stateService.buildings = [];
  }

  beforeApplicationShutdown(signal?: string) {
    this.logger.warn('received: ' + signal + ' - saving all buildings');
    this.stateService.saveBuildings();
  }

  onApplicationBootstrap() {
    this.stateService.notifyList
      .get('buildingUpdate')
      .push(this.notifyBuildingUpdate.bind(this));

    this.stateService.notifyList
      .get('terrainUpdate')
      .push(this.onTerrainUpdate.bind(this));
  }

  notifyBuildingUpdate() {
    this.websocketServer.emit(
      'buildings:requestUpdate',
      this.getVisibleBuildings({ name: 'a' } as any),
    );
  }

  onTerrainUpdate() {
    this.buildingPersistenceService
      .getAllBuildings(this.stateService.terrain.mapId)
      .then((buildings) => {
        buildings.forEach((building) =>
          this.stateService.buildings.push(building),
        );
      });
  }

  async validateAction(player: any, building: any) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    const currentBuilding = await this.buildingPersistenceService.getBuilding(
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

  saveBuildings() {
    this.stateService.buildings.forEach((building) =>
      this.buildingPersistenceService.updateBuilding(
        building,
        this.stateService.terrain.mapId,
      ),
    );
  }

  async validateCreate(player, building, block, upgrade = false) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);

    const buildingInThisSpace = (
      await this.buildingPersistenceService.getAllBuildings(
        this.stateService.terrain.mapId,
      )
    ).find((b) => b.x === player.x && b.y === player.y);
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
    newBuilding.growable = buildingDefinition.growable;
    if (newBuilding.growable) {
      const timer = new Timer(newBuilding.growable.cycleAmount, () => {
        const result = Growable.grow(newBuilding);
        this.stateService.updateBuilding(newBuilding);
        return result;
      });
      this.timerService.registerTimer(timer);
    }
    this.buildingPersistenceService.createBuilding(
      newBuilding,
      this.stateService.terrain.mapId,
    );
    this.stateService.updateBuilding(newBuilding);

    buildingDefinition.buildable.sourceItems.forEach((item) => {
      this.itemsService.removeItem(currentPlayer, item, item.requiredAmount);
    });
  }

  handleRemove(player: Player, building: Building) {
    this.buildingPersistenceService.removeBuilding(
      building,
      this.stateService.terrain.mapId,
    );
    this.stateService.updateBuilding(building, true);
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

  async handleAction(
    player: Player,
    action: string,
    building: Building,
    block: Block,
  ) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    const currentBuilding = await this.buildingPersistenceService.getBuilding(
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
    if (action == 'HARVEST') {
      this.handleRemove(currentPlayer, currentBuilding);
      this.itemsService.addItem(currentPlayer, { name: 'wood' } as any);
    }
  }

  getVisibleBuildings(player: Player) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    return this.stateService.buildings;
  }
}
