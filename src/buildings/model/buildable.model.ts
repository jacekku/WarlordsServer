import { SourceItemDefinition } from '@Items/model/crafting/source-item-definition.model';
import { Prop } from '@nestjs/mongoose';

export class Buildable {
  @Prop()
  sourceItems: SourceItemDefinition[];
}
