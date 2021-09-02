import { Controller, Get } from '@nestjs/common';
import { StateService } from './state.service';

@Controller('state')
export class StateController {
  constructor(private stateService: StateService) {}

  @Get()
  getState() {
    return this.stateService.getState();
  }

  @Get('definitions')
  getDefinitions() {
    return this.stateService.getDefinitions();
  }
}
