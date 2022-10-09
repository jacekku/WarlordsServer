import { Player } from '@Users/domain/model/player.model';

export abstract class PlayerConnected {
  abstract execute(player: Player);
}
