import { LoggingController } from '@Logging/logging.controller';
import { ConfigurableLogger } from '@Logging/logging.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('LoggingController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [LoggingController],
      providers: [ConfigurableLogger],
    }).compile();
  });

  it('should return all logging levels', () => {
    const loggingController = app.get<LoggingController>(LoggingController);
    const state = loggingController.getState();
    expect(state['LoggingController']).toEqual(['log', 'error', 'warn']);
  });
  it('should set logging levels', () => {
    const loggingController = app.get<LoggingController>(LoggingController);
    loggingController.setState({
      context: 'LoggingController',
      newLogLevels: 'debug',
    });
    const state = loggingController.getState();

    expect(state['LoggingController']).toEqual([
      'log',
      'error',
      'warn',
      'debug',
    ]);
  });
});
