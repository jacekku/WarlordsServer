import { Module } from '@nestjs/common';
import { LoggingController } from './logging.controller';
import { ConfigurableLogger } from './logging.service';

@Module({
  controllers: [LoggingController],
  providers: [ConfigurableLogger],
})
export class LoggingModule {}
