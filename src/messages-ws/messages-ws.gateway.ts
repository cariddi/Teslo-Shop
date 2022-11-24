import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { ServerEvents, ClientEvents } from './messages-ws.interfaces';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}
  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);

    this.wss.emit(
      ServerEvents.ClientsUpdated,
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);

    this.wss.emit(
      ServerEvents.ClientsUpdated,
      this.messagesWsService.getConnectedClients(),
    );
  }

  // message-from-client
  @SubscribeMessage(ClientEvents.ClientMsg)
  handleClientMsg(client: Socket, payload: NewMessageDto) {
    console.log({ id: client.id, payload });
  }
}
