import { Body, Controller, Get, LogLevel, Post } from '@nestjs/common';
import { ConfigurableLogger } from './logging.service';

@Controller('logging')
export class LoggingController {
  private logger = new ConfigurableLogger(LoggingController.name);

  @Get()
  getState() {
    return this.logger.servicesWithLogger();
  }

  @Post('set')
  setState(@Body() body: { context: string; newLogLevels: LogLevel[] }) {
    return this.logger.setLoggingLevel(body.context, body.newLogLevels);
  }
}
