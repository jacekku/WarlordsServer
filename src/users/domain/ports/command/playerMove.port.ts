import { Player } from '@Users/domain/model/player.model';

export abstract class PlayerMove {
  abstract execute(player: Player, move: { x: number; y: number });
}
