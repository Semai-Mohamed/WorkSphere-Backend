import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Project } from './project.entity';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([User,Project]),CaslModule],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
