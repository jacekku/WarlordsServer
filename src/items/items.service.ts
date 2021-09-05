import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { CraftingSourceItemDefinition } from 'src/model/inventory/crafting/crafting-source-item-definition.model';
import { Equiped } from 'src/model/inventory/equipment/equiped.model';
import { Inventory } from 'src/model/inventory/inventory.model';
import { ItemDefinition } from 'src/model/inventory/item-definition.model';
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
    if (!player.inventory.equiped) {
      player.inventory.equiped = new Equiped();
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
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    this.validate(currentPlayer, item);
    const itemDefinition = this.stateService.getItemDefinition(item);
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
      throw new WsException('no equiped on ' + item.equipable.type);
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

    this.validate(currentPlayer, item);
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

  public dropItem(player: Player, block: Block, item: Item) {
    return;
  }

  craftItem(player: Player, itemToCraft: Item) {
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
    sourceItems.forEach((item) =>
      this.removeItem(
        currentPlayer,
        item as ItemDefinition,
        (item as CraftingSourceItemDefinition).requiredAmount,
      ),
    );

    return this.addItem(currentPlayer, itemToCraft);
  }

  public getInventory(player) {
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    this.upsertPlayerInventory(currentPlayer);
    return currentPlayer.inventory;
  }
}
