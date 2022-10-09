import { Inject } from '@nestjs/common';
import { Player } from '@Users/domain/model/player.model';
import { PlayerMove } from '@Users/domain/ports/command/playerMove.port';
import { EventBus } from '@Users/domain/ports/event/eventBus.port';
import { EVENT } from 'src/constants';

export class PlayerMoveUseCase implements PlayerMove {
  constructor(@Inject(EventBus) private eventBus: EventBus) {}

  execute(player: Player, move: { x: number; y: number }) {
    this.eventBus.emitAsync(EVENT.PLAYER.MOVE, {
      player,
      move,
    });
  }
}
