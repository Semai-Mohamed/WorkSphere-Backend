import { Test, TestingModule } from '@nestjs/testing';
import { ConversationGateway } from './conversation.gateway';

describe('ConversationGateway', () => {
  let gateway: ConversationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationGateway],
    }).compile();

    gateway = module.get<ConversationGateway>(ConversationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
