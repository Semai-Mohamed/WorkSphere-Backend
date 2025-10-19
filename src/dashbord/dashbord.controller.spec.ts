import { Test, TestingModule } from '@nestjs/testing';
import { DashbordController } from './dashbord.controller';

describe('DashbordController', () => {
  let controller: DashbordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashbordController],
    }).compile();

    controller = module.get<DashbordController>(DashbordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
