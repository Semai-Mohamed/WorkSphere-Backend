import { Test, TestingModule } from '@nestjs/testing';
import { DashbordService } from './dashbord.service';

describe('DashbordService', () => {
  let service: DashbordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashbordService],
    }).compile();

    service = module.get<DashbordService>(DashbordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
