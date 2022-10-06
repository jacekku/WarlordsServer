import { JwtAuthGuard } from '@Auth/jwt-auth.guard';
import { Roles } from '@Auth/roles.decorator';
import { UseGuards, Controller, Get } from '@nestjs/common';
import { StateService } from '@State/state.service';

@UseGuards(JwtAuthGuard)
@Controller('state')
export class StateController {
  constructor(private stateService: StateService) {}

  @Get()
  @Roles('admin')
  getState() {
    return this.stateService.getState();
  }

  @Get('definitions')
  getDefinitions() {
    return this.stateService.getDefinitions();
  }
}
