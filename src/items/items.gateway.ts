import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Player } from 'src/model/users/player.model';
import { ItemsService } from './items.service';
import { Item } from 'src/model/inventory/item.model';
import { Inventory } from 'src/model/inventory/inventory.model';
import { ConfigurableLogger } from 'src/logging/logging.service';

@WebSocketGateway({
  cors: {
    origin: (host: string, callback) => {
      callback(null, process.env.CORS_ORIGIN);
    },
  },
})
export class ItemsWebsocketGateway {
  private readonly logger = new ConfigurableLogger(ItemsWebsocketGateway.name);

  constructor(public readonly itemsService: ItemsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('items:add')
  addItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('item') item: Item,
  ): WsResponse<any> {
    this.logger.debug('items:add ' + player + ' ' + JSON.stringify(item));
    const newInventory = this.itemsService.addItem(player, item);
    return this.buildWsResponse(newInventory);
  }
  @SubscribeMessage('items:remove')
  removeItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('item') item: Item,
  ): WsResponse<any> {
    this.logger.debug('items:remove ' + player + ' ' + JSON.stringify(item));
    const inventory: Inventory = this.itemsService.removeItem(player, item);
    return this.buildWsResponse(inventory);
  }
  @SubscribeMessage('items:transfer')
  transferItemHandler(
    @MessageBody('source') source: Player,
    @MessageBody('recipient') recipient: Player,
    @MessageBody('item') item: Item,
  ): WsResponse<any> {
    this.logger.debug(
      'items:transfer ' + source + ' ' + recipient + ' ' + JSON.stringify(item),
    );
    this.itemsService.transferItem(source, recipient, item);
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
    this.logger.debug(
      'items:craft ' + player + ' ' + JSON.stringify(itemToCraft),
    );
    const inventory = this.itemsService.craftItem(player, itemToCraft);
    return this.buildWsResponse(inventory);
  }

  @SubscribeMessage('items:equip')
  equipItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('itemToEquip') itemToEquip: Item,
  ): WsResponse<any> {
    this.logger.debug(
      'items:equip ' + player + ' ' + JSON.stringify(itemToEquip),
    );
    const inventory = this.itemsService.equipItem(player, itemToEquip);
    return this.buildWsResponse(inventory);
  }

  @SubscribeMessage('items:unequip')
  unequipItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('itemToUnequip') itemToUnequip: Item,
  ) {
    this.logger.debug(
      'items:unequip ' + player + ' ' + JSON.stringify(itemToUnequip),
    );
    const inventory = this.itemsService.unequipItem(player, itemToUnequip);
    return this.buildWsResponse(inventory);
  }

  @SubscribeMessage('items:move')
  moveItemHandler(
    @MessageBody('player') player: Player,
    @MessageBody('sourceIndex') sourceIndex: number,
    @MessageBody('targetIndex') targetIndex: number,
  ) {
    this.logger.debug(
      'items:move ' + player + ' ' + sourceIndex + ' ' + targetIndex,
    );
    const inventory = this.itemsService.moveItems(
      player,
      sourceIndex,
      targetIndex,
    );
    return this.buildWsResponse(inventory);
  }

  buildWsResponse(data: any, event = 'items:update'): WsResponse<any> {
    return {
      event,
      data,
    };
  }
}
