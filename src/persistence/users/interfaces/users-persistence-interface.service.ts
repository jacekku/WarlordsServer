import { Player } from 'src/users/model/player.model';

export interface IUsersPersistence {
  savePlayer(newPlayer: Player, mapId: string): void;
  getPlayer(playerName: string, mapId: string): Promise<Player>;
  registerPlayer(newPlayer: Player, mapId: string): Promise<Player>;
}
