import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class UsersWebsocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('identity')
  foo(@MessageBody() data: any) {
    return data;
  }
}
