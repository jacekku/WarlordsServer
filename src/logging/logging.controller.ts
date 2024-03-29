import { ConfigurableLogger } from '@Logging/logging.service';
import { Body, Controller, Get, LogLevel, Post } from '@nestjs/common';

@Controller('logging')
export class LoggingController {
  private logger = new ConfigurableLogger(LoggingController.name);

  @Get()
  getState() {
    return this.logger.servicesWithLogger();
  }

  @Post('set')
  setState(
    @Body() body: { context: string; newLogLevels: LogLevel[] | string },
  ) {
    return this.logger.setLoggingLevel(body.context, body.newLogLevels);
  }
}
