import { ItemCraft } from '@Items/ports/itemCraft.port';
import { ItemCraftFinished } from '@Items/ports/itemCraftFinished.port';
import {
  ItemCraftRequest,
  ItemCraftEvent,
} from '@Items/ports/itemCraftRequest.port';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT } from 'src/constants';

@Injectable()
export class ItemsEventListener {
  constructor(
    @Inject(ItemCraftRequest)
    private readonly itemCraftRequest: ItemCraftRequest,
    private readonly itemCraft: ItemCraft,
    private readonly itemCraftFinished: ItemCraftFinished,
  ) {}

  @OnEvent(EVENT.ITEMS.CRAFT_REQUEST)
  itemCraftStarted(payload: ItemCraftEvent) {
    this.itemCraftRequest.execute(payload);
  }

  @OnEvent(EVENT.ITEMS.CRAFT_VALIDATED)
  itemCraftValid(payload: ItemCraftEvent) {
    this.itemCraft.execute(payload);
  }

  @OnEvent(EVENT.ITEMS.CRAFT_FINISHED)
  itemCraftComplete(payload: ItemCraftEvent) {
    this.itemCraftFinished.execute(payload);
  }
}
