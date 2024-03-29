import { TestingModule, Test } from '@nestjs/testing';
import { StateController } from '@State/state.controller';
import { StateService } from '@State/state.service';

describe('StateController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [StateController],
      providers: [StateService],
    }).compile();
  });

  describe('State Controller', () => {
    it('should generate and return definitions', () => {
      const stateController = app.get<StateController>(StateController);
      const state = stateController.getDefinitions();
      expect(state.facilitiesDefinitions).toBeDefined();
      expect(state.itemDefinitions).toBeDefined();
    });

    it('should return state', () => {
      const stateController = app.get<StateController>(StateController);
      const state = stateController.getState();
      expect(state).toStrictEqual({
        terrain: undefined,
        players: undefined,
        buildings: undefined,
      });
    });
  });
});
