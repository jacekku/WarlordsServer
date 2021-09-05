import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { Player } from 'src/model/users/player.model';
import { ItemsService } from './items.service';
import { Item } from 'src/model/inventory/item.model';
import { Block } from 'src/model/terrain/block.model';
import { Inventory } from 'src/model/inventory/inventory.model';
import { CraftableItem } from 'src/model/inventory/crafting/craftable.model';

@WebSocketGateway({ cors: true })
export class ItemsWebsocketGateway {
  private readonly logger = new Logger(ItemsWebsocketGateway.name);

  constructor(public readonly itemsService: ItemsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('items:add')
  addItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('item') item: Item,
  ): WsResponse<any> {
    const newInventory = this.itemsService.addItem(player, item);
    return this.buildWsResponse(newInventory);
  }
  @SubscribeMessage('items:remove')
  removeItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('item') item: Item,
  ): WsResponse<any> {
    const inventory: Inventory = this.itemsService.removeItem(player, item);
    return this.buildWsResponse(inventory);
  }
  @SubscribeMessage('items:transfer')
  transferItemHandler(
    @MessageBody('source') source: Player,
    @MessageBody('source') recipient: Player,
    @MessageBody('item') item: Item,
  ): WsResponse<any> {
    this.itemsService.transferItem(source, recipient, item);
    return this.buildWsResponse(null);
  }
  @SubscribeMessage('items:drop')
  dropItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('block') block: Block,
    @MessageBody('item') item: Item,
  ): WsResponse<any> {
    this.itemsService.dropItem(player, block, item);
    return this.buildWsResponse(null);
  }

  @SubscribeMessage('items:update')
  updateItemsHandler(
    @MessageBody('player') player: Player,
  ): WsResponse<Inventory> {
    const inventory = this.itemsService.getInventory(player);
    return this.buildWsResponse(inventory);
  }

  @SubscribeMessage('items:craft')
  craftItemsHandler(
    @MessageBody('player') player: Player,
    @MessageBody('itemToCraft') itemToCraft: Item,
  ): WsResponse<Inventory> {
    const inventory = this.itemsService.craftItem(player, itemToCraft);
    return this.buildWsResponse(inventory);
  }

  @SubscribeMessage('items:equip')
  equipItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('itemToEquip') itemToEquip: Item,
  ): WsResponse<any> {
    const inventory = this.itemsService.equipItem(player, itemToEquip);
    return this.buildWsResponse(inventory);
  }

  @SubscribeMessage('items:unequip')
  unequipItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('itemToUnequip') itemToUnequip: Item,
  ) {
    const inventory = this.itemsService.unequipItem(player, itemToUnequip);
    return this.buildWsResponse(inventory);
  }

  buildWsResponse(data: any, event = 'items:update'): WsResponse<any> {
    return {
      event,
      data,
    };
  }
}
