import { Module } from '@nestjs/common';
import { PersistenceModule } from '@Persistence/persistence.module';
import { StateModule } from '@State/state.module';
import { UsersController } from '@Users/users.controller';
import { UsersWebsocketGateway } from '@Users/users.gateway';
import { UsersService } from '@Users/users.service';

@Module({
  imports: [PersistenceModule, StateModule],
  controllers: [UsersController],
  providers: [UsersService, UsersWebsocketGateway],
})
export class UsersModule {}
