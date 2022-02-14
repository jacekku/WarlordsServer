import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Player } from 'src/users/model/player.model';

export type PlayerDocument = Player & Document;

export const PlayerSchemas = SchemaFactory.createForClass(Player);
