import { Prop } from '@nestjs/mongoose';
import { SourceItemDefinition } from '../../items/model/crafting/source-item-definition.model';

export class Buildable {
  @Prop()
  sourceItems: SourceItemDefinition[];
}
