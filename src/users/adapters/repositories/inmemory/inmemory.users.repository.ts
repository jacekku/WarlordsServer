import { NotImplementedException } from '@nestjs/common';
import { Character } from '@Users/domain/model/character.model';
import { Player } from '@Users/domain/model/player.model';
import { IUsersPersistence } from '@Users/domain/ports/repositories/usersRepo.port';

export class InMemoryUserRepository implements IUsersPersistence {
  PLAYERS = {};

  CHARACTERS: Character[] = [];

  savePlayer(newPlayer: Player, mapId: string): Promise<Player> {
    if (!this.PLAYERS[mapId]) {
      this.PLAYERS[mapId] = {};
    }
    this.PLAYERS[mapId][newPlayer.name] = newPlayer;
    return this.PLAYERS[mapId][newPlayer.name];
  }

  getPlayer(playerName: string, mapId: string): Promise<Player> {
    return this.PLAYERS[mapId][playerName];
  }

  async registerCharacter(newCharacter: Character): Promise<Character> {
    const { characterName, mapId } = newCharacter;
    if (!(await this.getCharacter(characterName, mapId))) {
      this.CHARACTERS.push(newCharacter);
    }
    return await this.getCharacter(characterName, mapId);
  }
  getCharacters(uid: string): Promise<Character[]> {
    return Promise.resolve(this.CHARACTERS.filter((ch) => ch.uid == uid));
  }
  getCharacter(characterName: string, mapId: string): Promise<Character> {
    return Promise.resolve(
      this.CHARACTERS.find(
        (ch) => ch.characterName == characterName && ch.mapId == mapId,
      ),
    );
  }
}
