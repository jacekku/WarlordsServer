import { Module } from '@nestjs/common';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { UsersController } from './users.controller';
import { UsersWebsocketGateway } from './users.gateway';
import { UsersService } from './users.service';

@Module({
  imports: [PersistenceModule],
  controllers: [UsersController],
  providers: [UsersService, UsersWebsocketGateway],
})
export class UsersModule {}
