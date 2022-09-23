import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: '/chat', cors: '*:*' })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('AppGateway');

  handleDisconnect(client: Socket) {
    this.logger.log('client disconnected', client.id);
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('client connected', client.id);
  }
  afterInit(server: Server) {
    this.logger.log('gateway is initialised');
  }
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    this.wss.emit('MESSAGES', text);
    this.logger.log('msgToServer', text);
  }
}
