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
    return {
      event: 'items:update',
      data: newInventory,
    };
  }
  @SubscribeMessage('items:remove')
  removeItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('item') item: Item,
  ) {
    this.itemsService.removeItem(player, item);
  }
  @SubscribeMessage('items:transfer')
  transferItemHandler(
    @MessageBody('source') source: Player,
    @MessageBody('source') recipient: Player,
    @MessageBody('item') item: Item,
  ) {
    this.itemsService.transferItem(source, recipient, item);
  }
  @SubscribeMessage('items:drop')
  dropItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('block') block: Block,
    @MessageBody('item') item: Item,
  ) {
    this.itemsService.dropItem(player, block, item);
  }

  @SubscribeMessage('items:update')
  updateItemsHandler(
    @MessageBody('player') player: Player,
  ): WsResponse<Inventory> {
    const inventory = this.itemsService.getInventory(player);
    return {
      event: 'items:update',
      data: inventory,
    };
  }
}
