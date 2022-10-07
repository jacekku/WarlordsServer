import { Module } from '@nestjs/common';
import { StateModule } from '@State/state.module';
import { IUsersPersistence } from '@Users/domain/ports/users-persistence-interface.service';
import {
  CharacterSchema,
  PlayerSchema,
} from '@Users/adapters/repositories/mongodb/schema/user.schema';
import { Character } from '@Users/adapters/repositories/mongodb/schema/character.model';
import { Player } from '@Users/domain/model/player.model';
import { UsersWebsocketGateway } from '@Users/adapters/api/users.gateway';
import { UsersServiceUseCase } from '@Users/usecase/users.service';
import { InMemoryUserRepository } from '@Users/adapters/repositories/inmemory/inmemory.users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandUsersController } from '@Users/adapters/api/commandUser.controller';
import { QueryUsersController } from '@Users/adapters/api/queryUser.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Character.name, schema: CharacterSchema },
    ]),
    StateModule,
  ],
  controllers: [QueryUsersController, CommandUsersController],
  providers: [
    UsersServiceUseCase,
    UsersWebsocketGateway,
    {
      provide: IUsersPersistence,
      useClass: InMemoryUserRepository,
    },
  ],
})
export class UsersModule {}
