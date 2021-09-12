import { Test, TestingModule } from '@nestjs/testing';
import { StateService } from 'src/state/state.service';
import { ItemsController } from '../items.controller';
import { ItemsService } from '../items.service';

describe('ItemsController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [ItemsService, StateService],
    }).compile();
  });

  it('smoke test', () => {
    app.get<ItemsController>(ItemsController);
  });
});
