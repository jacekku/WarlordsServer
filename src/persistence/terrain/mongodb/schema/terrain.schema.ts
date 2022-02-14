import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Chunk } from 'src/terrain/model/chunk.model';
import { Terrain } from 'src/terrain/model/terrain.model';

export type TerrainDocument = Terrain & Document;

export const TerrainSchema = SchemaFactory.createForClass(Terrain);

export type ChunkDocument = Chunk & Document;

export const ChunkSchema = SchemaFactory.createForClass(Chunk);
