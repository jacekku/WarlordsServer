import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Character } from 'src/users/model/character.model';
import { Player } from 'src/users/model/player.model';

export type PlayerDocument = Player & Document;

export const PlayerSchema = SchemaFactory.createForClass(Player);

export type CharacterDocument = Character & Document;
export const CharacterSchema = SchemaFactory.createForClass(Character);
