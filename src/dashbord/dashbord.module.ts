import { Module } from '@nestjs/common';
import { DashbordController } from './dashbord.controller';
import { DashbordService } from './dashbord.service';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [DashbordController],
  providers: [DashbordService],
})
export class DashbordModule {}
