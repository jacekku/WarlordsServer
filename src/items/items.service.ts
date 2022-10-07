import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ConfigurableLogger } from 'src/logging/logging.service';
import { StateService } from 'src/state/state.service';
import { Block } from 'src/terrain/model/block.model';
import { Player } from 'src/common_model/player.model';
import { ItemsActionMapper } from './items-action.mapper';
import { SourceItemDefinition } from './model/crafting/source-item-definition.model';
import { Equiped } from './model/equipment/equiped.model';
import { Inventory } from './model/inventory.model';
import { ItemDefinition } from './model/item-definition.model';
import { Item } from './model/item.model';

@Injectable()
export class ItemsService {
  private readonly logger = new ConfigurableLogger(ItemsService.name);

  constructor(public readonly stateService: StateService) {}

  public playerHasItems(player: Player, item: Item, amount = 1): boolean {
    const itemAmount = player.inventory.collapseInventory().get(item.name);

    if (!itemAmount || itemAmount < amount) {
      throw new WsException(
        `${amount} ${item.name} not found on player: ${player.name}`,
      );
    }
    return true;
  }

  private playerInventoryIsFull(player: Player, item: Item) {
    return player.inventory.isFull(item);
  }
  private upsertPlayerInventory(player: Player) {
    if (!player.inventory) {
      player.inventory = new Inventory();
    }
    if (!player.inventory.equiped) {
      player.inventory.equiped = new Equiped();
    }
    player.inventory = Inventory.wrapInventory(player.inventory);
  }

  private itemExists(item: Item) {
    if (!this.stateService.itemExists(item)) {
      throw new WsException(`item: ${JSON.stringify(item)} does not exist!`);
    }
    return true;
  }

  private validate(player, item, amount = 1) {
    this.playerHasItems(player, item, amount);
    this.itemExists(item);
  }

  validateAction(player: Player, action: string, block: Block) {
    const actualBlock = this.stateService.findBlock(block);
    const itemName = ItemsActionMapper.mapActionToItem(action, actualBlock);
    if (!itemName) {
      throw new WsException(`${action} didn't succeed`);
    }
    const itemDefinition = this.stateService.getItemDefinition({
      name: itemName,
    } as any);
    if (!itemDefinition.name) {
      this.logger.error(itemName + ' not found in item definitions');
      throw new WsException(itemName + ' not found in item definitions');
    }
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    if (this.playerInventoryIsFull(currentPlayer, itemDefinition as Item)) {
      throw new WsException('player inventory is full');
    }
    return itemDefinition;
  }

  validateCraftItem(player: Player, itemToCraft: Item) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    this.itemExists(itemToCraft);
    const itemToCraftDefinition =
      this.stateService.getItemDefinition(itemToCraft);
    if (!itemToCraftDefinition.craftable) {
      throw new WsException(`${itemToCraftDefinition} is not craftable`);
    }
    const sourceItems = itemToCraftDefinition.craftable.sourceItems;
    sourceItems.forEach((item) => this.validate(currentPlayer, item));
    if (this.playerInventoryIsFull(currentPlayer, itemToCraft)) {
      throw new WsException('player inventory is full');
    }
  }

  handleAction(player: Player, itemDefinition: Item) {
    return this.addItem(player, itemDefinition as Item);
  }

  public equipItem(player: Player, item: Item) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    this.validate(currentPlayer, item);
    const itemDefinition = this.stateService.getItemDefinition(item);
    if (!itemDefinition.equipable)
      throw new WsException(itemDefinition.name + ' is not equipable');
    const itemToEquip =
      currentPlayer.inventory.findItemByDefinition(itemDefinition);
    currentPlayer.inventory.equipItem(itemToEquip);
    return this.removeItem(currentPlayer, itemToEquip);
  }

  public unequipItem(player: Player, item: Item) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    this.itemExists(item);
    const itemDefinition = this.stateService.getItemDefinition(item);
    const itemToUnequip =
      currentPlayer.inventory.findEquipedItemByDefinition(itemDefinition);
    if (!itemToUnequip.name)
      throw new WsException(
        `no equiped item found on ${itemDefinition.equipable.type}`,
      );
    currentPlayer.inventory.unequipItem(itemToUnequip);
    return this.addItem(player, itemDefinition as Item);
  }

  public addItem(player: Player, item: Item) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    if (this.playerInventoryIsFull(currentPlayer, item)) {
      throw new WsException('player inventory is full');
    }
    const itemDefinition = this.stateService.getItemDefinition(item);
    currentPlayer.inventory.addItem(itemDefinition as Item);
    return currentPlayer.inventory;
  }

  public removeItem(player: Player, item: ItemDefinition, amount = 1) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);

    this.validate(currentPlayer, item, amount);
    const itemDefinition = this.stateService.getItemDefinition(item);
    for (let i = 0; i < amount; i++) {
      currentPlayer.inventory.removeItem(itemDefinition);
    }
    return currentPlayer.inventory;
  }
  // public removeItems(player: Player, items: Item[]) {}

  public transferItem(source: Player, recipient: Player, item: Item) {
    const currentSource = this.stateService.findConnectedPlayer(source);
    const currentRecipient = this.stateService.findConnectedPlayer(recipient);

    this.upsertPlayerInventory(currentSource);
    this.upsertPlayerInventory(currentRecipient);
    this.validate(currentSource, item);
    this.addItem(currentRecipient, item);
    this.validate(currentRecipient, item);
    return this.removeItem(currentSource, item);
  }
  // public transferItems(source: Player, recipient: Player, items: Item[]) {}

  craftItem(player: Player, itemToCraft: Item) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    const itemToCraftDefinition =
      this.stateService.getItemDefinition(itemToCraft);
    const sourceItems = itemToCraftDefinition.craftable.sourceItems;

    sourceItems.forEach((item) =>
      this.removeItem(
        currentPlayer,
        item as ItemDefinition,
        (item as SourceItemDefinition).requiredAmount,
      ),
    );

    return this.addItem(currentPlayer, itemToCraft);
  }

  public moveItems(player: Player, sourceIndex: number, targetIndex: number) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    currentPlayer.inventory.moveItems(sourceIndex, targetIndex);
    return currentPlayer.inventory;
  }

  public getInventory(player) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    if (!currentPlayer) return;
    this.upsertPlayerInventory(currentPlayer);
    return currentPlayer.inventory;
  }
}
