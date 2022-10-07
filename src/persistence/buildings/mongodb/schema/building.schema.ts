import { Building } from '@Buildings/model/building.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BuildingDocument = Building & Document;

export const BuildingSchema = SchemaFactory.createForClass(Building);
