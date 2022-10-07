import { LoggingController } from '@Logging/logging.controller';
import { ConfigurableLogger } from '@Logging/logging.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [LoggingController],
  providers: [ConfigurableLogger],
})
export class LoggingModule {}
