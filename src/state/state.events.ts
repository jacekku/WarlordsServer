import { Player } from '@Common/player.model';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StateService } from '@State/state.service';
import { EVENT } from 'src/constants';

@Injectable()
export class StateEventListener {
  constructor(private readonly stateService: StateService) {}

  @OnEvent(EVENT.PLAYER.DISCONNECTED, { async: true })
  playerDisconnected(payload: Player) {
    // TODO: move this out to state event listener
    this.stateService.players = this.stateService.players.filter(
      (player) => player.name != payload.name,
    );
  }
}
