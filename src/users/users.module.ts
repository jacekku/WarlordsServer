import { Module } from '@nestjs/common';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { StateModule } from 'src/state/state.module';
import { UsersController } from './users.controller';
import { UsersWebsocketGateway } from './users.gateway';
import { UsersService } from './users.service';

@Module({
  imports: [PersistenceModule, StateModule],
  controllers: [UsersController],
  providers: [UsersService, UsersWebsocketGateway],
})
export class UsersModule {}
