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
import { Block } from 'src/model/terrain/block.model';

@WebSocketGateway({
  cors: {
    origin: (host: string, callback) => {
      callback(null, process.env.CORS_ORIGIN.split(','));
    },
  },
})
export class ItemsWebsocketGateway {
  private readonly logger = new ConfigurableLogger(ItemsWebsocketGateway.name);

  constructor(public readonly itemsService: ItemsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('items:action')
  handleAction(client: any, payload: any) {
    const { player, action, block, success } = payload;
    this.logger.debug(
      `items:command ${player.name} ${action} ${JSON.stringify(block)}`,
    );
    const newInventory = this.itemsService.handleAction(player, action, block);
    client.emit('items:update', newInventory);
    client.emit('success', success);
  }

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
  craftItemsHandler(client: any, payload: any) {
    const { player, itemToCraft, success } = payload;
    this.logger.debug(
      'items:craft ' + player + ' ' + JSON.stringify(itemToCraft),
    );
    const inventory = this.itemsService.craftItem(player, itemToCraft);
    client.emit('items:update', inventory);
    client.emit('success', success);
  }

  @SubscribeMessage('items:equip')
  equipItemHandler(client: any, payload: any) {
    const { player, itemToEquip, success } = payload;
    this.logger.debug(
      'items:equip ' + player + ' ' + JSON.stringify(itemToEquip),
    );
    const inventory = this.itemsService.equipItem(player, itemToEquip);
    client.emit('items:update', inventory);
    client.emit('success', success);
  }

  @SubscribeMessage('items:unequip')
  unequipItemHandler(client: any, payload: any) {
    const { player, itemToUnequip, success } = payload;
    this.logger.debug(
      'items:unequip ' + player + ' ' + JSON.stringify(itemToUnequip),
    );
    const inventory = this.itemsService.unequipItem(player, itemToUnequip);
    client.emit('items:update', inventory);
    client.emit('success', success);
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
