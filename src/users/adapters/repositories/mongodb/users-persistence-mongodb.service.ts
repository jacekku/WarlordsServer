import { Injectable } from '@nestjs/common';
import { Character } from '@Users/domain/model/character.model';
import { Player } from '@Users/domain/model/player.model';
import { IUsersPersistence } from '@Users/domain/ports/users-persistence-interface.service';
import { Model } from 'mongoose';
import { CharacterDocument, PlayerDocument } from './schema/user.schema';

@Injectable()
export class UsersMongoService implements IUsersPersistence {
  constructor(
    private playerModel: Model<PlayerDocument>,
    private characterModel: Model<CharacterDocument>,
  ) {}

  async savePlayer(newPlayer: Player, mapId: string): Promise<Player> {
    newPlayer.mapId = mapId;
    return new this.playerModel(newPlayer).save();
  }

  async getPlayer(playerName: string, mapId: string): Promise<Player> {
    return this.playerModel
      .findOne({
        $and: [{ mapId: mapId }, { name: playerName }],
      })
      .exec();
  }

  async getCharacters(uid: string): Promise<Character[]> {
    return this.characterModel
      .find({
        uid: uid,
      })
      .exec();
  }

  async registerCharacter(newCharacter: Character): Promise<Character> {
    return new this.characterModel(newCharacter).save();
  }

  async getCharacter(characterName: string, mapId: string): Promise<Character> {
    return this.characterModel
      .exists({
        characterName: characterName,
        mapId: mapId,
      })
      .exec() as unknown as Character;
  }
}
