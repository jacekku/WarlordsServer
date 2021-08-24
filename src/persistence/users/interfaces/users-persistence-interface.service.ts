import { Player } from 'src/model/users/player.model';

export interface IUsersPersistence {
  savePlayer(newPlayer: Player, mapId: string): void;
  getPlayer(playerName: string, mapId: string): Player;
}
