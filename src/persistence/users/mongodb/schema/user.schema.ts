import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Character } from '@Users/domain/model/character.model';
import { Player } from '@Users/domain/model/player.model';

export type PlayerDocument = Player & Document;

export const PlayerSchema = SchemaFactory.createForClass(Player);

export type CharacterDocument = Character & Document;
export const CharacterSchema = SchemaFactory.createForClass(Character);
