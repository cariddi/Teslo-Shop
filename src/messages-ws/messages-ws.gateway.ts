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
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    console.log({ token });
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      client.disconnect();
      return;
    }

    console.log({ payload });

    this.messagesWsService.registerClient(client);

    this.wss.emit(
      ServerEvents.ClientsUpdated,
      this.messagesWsService.getConnectedClients(),
    );

    // emit to specific room or namespace
    // this.wss.to("room or namespace").emit("event", {});

    // join client to specific room or namespace
    // client.join("room or namespace")
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

    // emit to specific client
    // client.emit(ServerEvents.ServerMsg, {
    //   fullName: 'Server',
    //   message: payload.message || 'no msg',
    // });

    // emit to ALL clients but the one who sent the msg
    // client.broadcast.emit(ServerEvents.ServerMsg, {
    //   fullName: 'Server',
    //   message: payload.message || 'no msg',
    // });

    // emit to ALL clients
    this.wss.emit(ServerEvents.ServerMsg, {
      fullName: 'Server',
      message: payload.message || 'no msg',
    });
  }
}
