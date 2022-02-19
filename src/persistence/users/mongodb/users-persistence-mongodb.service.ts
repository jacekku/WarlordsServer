import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Character } from 'src/users/model/character.model';
import { Player } from 'src/users/model/player.model';
import { IUsersPersistence } from '../interfaces/users-persistence-interface.service';
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

  async registerPlayer(newPlayer: Player, mapId: string): Promise<Player> {
    return this.savePlayer(newPlayer, mapId);
  }

  registerCharacter(newCharacter: Character): Promise<Character> {
    return new this.characterModel(newCharacter).save();
  }
}
