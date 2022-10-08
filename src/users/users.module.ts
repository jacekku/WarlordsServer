import { Module } from '@nestjs/common';
import { StateModule } from '@State/state.module';
import { IUsersPersistence } from '@Users/domain/ports/repositories/usersRepo.port';
import {
  CharacterSchema,
  PlayerSchema,
} from '@Users/adapters/repositories/mongodb/schema/user.schema';
import { Character } from '@Users/adapters/repositories/mongodb/schema/character.model';
import { Player } from '@Users/domain/model/player.model';
import { UsersWebsocketGateway } from '@Users/adapters/api/users.gateway';
import { UsersService } from '@Users/usecase/users.service';
import { InMemoryUserRepository } from '@Users/adapters/repositories/inmemory/inmemory.users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandUsersController } from '@Users/adapters/api/commandUser.controller';
import { QueryUsersController } from '@Users/adapters/api/queryUser.controller';
import { GetPlayer } from '@Users/domain/ports/driving/getPlayer.port';
import { GetPlayerUseCase } from '@Users/usecase/query/getPlayer.usecase';
import { GetCharacters } from '@Users/domain/ports/driving/getCharacters.port';
import { GetCharactersUseCase } from '@Users/usecase/query/getCharacters.usecase';

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
    UsersService,
    UsersWebsocketGateway,
    {
      provide: IUsersPersistence,
      useClass: InMemoryUserRepository,
    },
    { provide: GetPlayer, useClass: GetPlayerUseCase },
    { provide: GetCharacters, useClass: GetCharactersUseCase },
  ],
})
export class UsersModule {}
