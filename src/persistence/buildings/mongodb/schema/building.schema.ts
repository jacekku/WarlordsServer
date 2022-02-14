import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Building } from 'src/buildings/model/building.model';

export type BuildingDocument = Building & Document;

export const BuildingSchema = SchemaFactory.createForClass(Building);
