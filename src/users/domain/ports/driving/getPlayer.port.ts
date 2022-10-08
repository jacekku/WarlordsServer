import { Player } from '@Users/domain/model/player.model';

export abstract class GetPlayer {
  abstract execute(playerName: string): Promise<Player>;
}
