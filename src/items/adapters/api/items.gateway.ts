import { Player } from '@Common/player.model';
import { Inventory } from '@Common/items/inventory.model';
import { ItemsService } from '@Items/items.service';
import { ConfigurableLogger } from '@Logging/logging.service';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { TimerService } from '@Timer/timer.service';
import { Server } from 'socket.io';
import { Item } from '@Common/items/item.model';
import { Inject } from '@nestjs/common';
import { EventBus } from 'src/infrastructure/eventBus.port';
import { EVENT } from 'src/constants';

@WebSocketGateway({
  cors: {
    origin: (host: string, callback) => {
      callback(null, process.env.CORS_ORIGIN.split(','));
    },
  },
})
export class ItemsWebsocketGateway {
  private readonly logger = new ConfigurableLogger(ItemsWebsocketGateway.name);

  constructor(
    public readonly itemsService: ItemsService,
    private readonly timerService: TimerService,
    @Inject(EventBus) private readonly eventBus: EventBus,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('items:action')
  handleAction(client: any, payload: any) {
    const { player, action, block, success } = payload;
    this.logger.debug(
      `items:command ${player.name} ${action} ${JSON.stringify(block)}`,
    );
    const itemDefinition = this.itemsService.validateAction(
      player,
      action,
      block,
    );
    const timerCallback = () => {
      const newInventory = this.itemsService.handleAction(
        player,
        itemDefinition as Item,
      );
      client.emit('items:update', newInventory);
      client.emit('success', success);
    };
    const timer = this.timerService.addTimer(player, action, timerCallback);
    client.emit('timer', timer);
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
    if (!player.name) return;
    const inventory = this.itemsService.getInventory(player);
    return this.buildWsResponse(inventory);
  }

  @SubscribeMessage('items:craft')
  craftItemsHandler(client: any, payload: any) {
    const { player, itemToCraft, success } = payload;
    this.logger.debug(
      'items:craft ' + player + ' ' + JSON.stringify(itemToCraft),
    );
    // emit event dont even validate
    this.eventBus.emitAsync(EVENT.ITEMS.CRAFT_REQUEST, {
      player,
      itemToCraft,
    });
    // this.itemsService.validateCraftItem(player, itemToCraft);
    // const callback = () => {
    //   const inventory = this.itemsService.craftItem(player, itemToCraft);
    //   client.emit('items:update', inventory);
    //   client.emit('success', success);
    // };
    // const timer = this.timerService.addTimer(player, 'CRAFT', callback);
    // client.emit('timer', timer);
  }

  async itemCraftFinished(player: Player, inventory: Inventory) {
    const client: any = await (
      await this.server.fetchSockets()
    ).find((s) => (s as any).player == player.name);
    client.emit('items:update', inventory);
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
