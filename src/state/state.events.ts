import { Player } from '@Common/player.model';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StateService } from '@State/state.service';
import { EVENT } from 'src/constants';

@Injectable()
export class StateEventListener {
  constructor(private readonly stateService: StateService) {}

  @OnEvent(EVENT.PLAYER.DISCONNECTED)
  playerDisconnected(payload: Player) {
    this.stateService.players = this.stateService.players.filter(
      (player) => player.name != payload.name,
    );
  }

  @OnEvent(EVENT.PLAYER.MOVE)
  playerMove(payload: { player: Player; move: { x: number; y: number } }) {
    this.stateService.movePlayer(payload.player, payload.move);
  }
}
