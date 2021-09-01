import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { wrap } from 'lodash';
import { Equiped } from 'src/model/inventory/equiped.model';
import { Inventory } from 'src/model/inventory/inventory.model';
import { Item } from 'src/model/inventory/item.model';
import { Block } from 'src/model/terrain/block.model';
import { Player } from 'src/model/users/player.model';
import { StateController } from 'src/state/state.controller';
import { StateService } from 'src/state/state.service';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  constructor(public readonly stateService: StateService) {}

  private playerHasItem(player: Player, item: Item): boolean {
    if (!!player.inventory.items.find((invItem) => invItem.uid === item.uid)) {
      return true;
    }
    throw new NotFoundException(
      `item: ${JSON.stringify(item)} not found on player: ${player.name}`,
    );
  }
  private playerInventoryIsFull(player: Player) {
    return player.inventory.isFull();
  }
  private upsertPlayerInventory(player: Player) {
    if (!player.inventory) {
      player.inventory = new Inventory();
    }
    player.inventory = Inventory.wrapInventory(player.inventory);
  }

  public equipItem(player: Player, item: Item) {
    this.playerHasItem(player, item);
  }

  public addItem(player: Player, item: Item) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    if (this.playerInventoryIsFull(currentPlayer)) {
      return false;
    }
    currentPlayer.inventory.addItem(item);
    return currentPlayer.inventory;
  }

  public removeItem(player: Player, item: Item) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);

    this.upsertPlayerInventory(currentPlayer);

    this.playerHasItem(currentPlayer, item);
    return currentPlayer.inventory.removeItem(item);
  }
  // public removeItems(player: Player, items: Item[]) {}

  public transferItem(source: Player, recipient: Player, item: Item) {
    const currentSource = this.stateService.findConnectedPlayer(source);
    const currentRecipient = this.stateService.findConnectedPlayer(recipient);

    this.upsertPlayerInventory(currentSource);
    this.upsertPlayerInventory(currentRecipient);
    this.playerHasItem(currentSource, item);
    currentRecipient.inventory.addItem(item);
    this.playerHasItem(currentRecipient, item);
    return currentSource.inventory.removeItem(item);
  }
  // public transferItems(source: Player, recipient: Player, items: Item[]) {}

  public dropItem(player: Player, block: Block, item: Item) {
    return;
  }

  public getInventory(player) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    return currentPlayer.inventory;
  }
}
