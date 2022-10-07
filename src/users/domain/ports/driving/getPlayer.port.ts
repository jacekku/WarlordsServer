import { Player } from '@Users/domain/model/player.model';

export abstract class GetPlayer {
  abstract getPlayer(playerName: string): Promise<Player>;
}
