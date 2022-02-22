import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { StateService } from './state.service';

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
