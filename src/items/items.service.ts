import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Inventory } from 'src/model/inventory/inventory.model';
import { Item } from 'src/model/inventory/item.model';
import { Block } from 'src/model/terrain/block.model';
import { Player } from 'src/model/users/player.model';
import { StateService } from 'src/state/state.service';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  constructor(public readonly stateService: StateService) {}

  private playerHasItem(player: Player, item: Item): boolean {
    if (
      !player.inventory.items
        .filter(Boolean)
        .find((invItem) => Inventory.itemComparator(invItem, item))
    ) {
      throw new WsException(
        `item: ${JSON.stringify(item)} not found on player: ${player.name}`,
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
    player.inventory = Inventory.wrapInventory(player.inventory);
  }

  private itemExists(item: Item) {
    if (
      !this.stateService.itemDefinitions.find((i) =>
        Inventory.itemComparator(i, item),
      )
    ) {
      throw new WsException(`item: ${JSON.stringify(item)} does not exist!`);
    }
    return true;
  }

  private validate(player, item) {
    this.playerHasItem(player, item);
    this.itemExists(item);
  }

  public equipItem(player: Player, item: Item) {
    this.validate(player, item);
  }

  public addItem(player: Player, item: Item) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    if (this.playerInventoryIsFull(currentPlayer, item)) {
      throw new WsException('player inventory is full');
    }
    item = this.stateService.getItemDefinition(item);
    currentPlayer.inventory.addItem(item);
    return currentPlayer.inventory;
  }

  public removeItem(player: Player, item: Item) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);

    this.upsertPlayerInventory(currentPlayer);

    this.validate(currentPlayer, item);
    const itemDefinition = this.stateService.getItemDefinition(item);
    currentPlayer.inventory.removeItem(itemDefinition);
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

  public dropItem(player: Player, block: Block, item: Item) {
    return;
  }

  craftItem(player: Player, itemToCraft: Item) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    this.itemExists(itemToCraft);
    itemToCraft = this.stateService.getItemDefinition(itemToCraft);
    if (!itemToCraft.craftable) {
      throw new WsException(`${itemToCraft} is not craftable`);
    }
    const sourceItems = itemToCraft.craftable.sourceItems;
    sourceItems.forEach((item) => this.validate(currentPlayer, item));
    const playerItems = sourceItems.map((item) =>
      currentPlayer.inventory.findItemByDefinition(item),
    );
    playerItems.forEach((item) => this.removeItem(currentPlayer, item));

    return this.addItem(currentPlayer, itemToCraft);
  }

  public getInventory(player) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    return currentPlayer.inventory;
  }
}
