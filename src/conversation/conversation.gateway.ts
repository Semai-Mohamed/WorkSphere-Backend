import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(
  {  cors: { origin: '*' }}
)
export class ConversationGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
