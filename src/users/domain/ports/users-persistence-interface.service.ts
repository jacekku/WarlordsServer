import { Character } from '@Users/domain/model/character.model';
import { Player } from '@Users/domain/model/player.model';

export abstract class IUsersPersistence {
  abstract savePlayer(newPlayer: Player, mapId: string): Promise<Player>;
  abstract getPlayer(playerName: string, mapId: string): Promise<Player>;

  abstract registerCharacter(newCharacter: Character): Promise<Character>;
  abstract getCharacter(
    characterName: string,
    mapId: string,
  ): Promise<Character>;
  abstract getCharacters(uid: string): Promise<Character[]>;
}
