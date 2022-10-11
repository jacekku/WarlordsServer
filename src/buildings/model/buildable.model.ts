import { SourceItemDefinition } from '@Items/domain/model/crafting/source-item-definition.model';
import { Prop } from '@nestjs/mongoose';

export class Buildable {
  @Prop()
  sourceItems: SourceItemDefinition[];
}
