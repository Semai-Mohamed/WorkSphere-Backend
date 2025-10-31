import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'node_modules/typeorm';
import { User } from 'src/user/user.entity';
import { UpdateProjectDto, CreateProjectDto } from 'src/dto/project.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { CloudinaryStrategy } from 'src/common/strategies/cloudinary.strategy';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly cloudinaryStrategy: CloudinaryStrategy,
  ) {}

  async addProject(
    dto: CreateProjectDto,
    userId: number,
    file: Express.Multer.File,
  ): Promise<Project> {
    let photoUrl: string | undefined = undefined;
    if (file) {
      photoUrl = (await this.cloudinaryStrategy.uploadFile(
        file,
        'portfolios-photos',
      )) as string;
    }
    const project = this.projectRepository.create({
      ...dto,
      user: { id: userId },
      photo: photoUrl,
    });
    if (!project) throw new BadRequestException('Cannot create project');
    return this.projectRepository.save(project);
  }

  async getProjectsByUser(userId: number): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: { user: { id: userId } },
    });
    if (!projects) throw new NotFoundException('Cannot get projects');
    return projects;
  }

  async getProjectById(projectId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['user'],
    });
    if (!project) throw new NotFoundException('Cannot get project');
    return project;
  }

  async updateProject(
    projectId: number,
    dto: UpdateProjectDto,
    file?: Express.Multer.File,
  ): Promise<Project> {
    const project = await this.getProjectById(projectId);
    let photoUrl: string | undefined = undefined;
    if (file) {
      photoUrl = (await this.cloudinaryStrategy.uploadFile(
        file,
        'projects-photos',
      )) as string;
    }
    const updatedProject = await this.projectRepository.preload({
      ...dto,
      id: project.id,
      photo: photoUrl,
    });
    if (!updatedProject)
      throw new BadRequestException('cannot update your project');
    return await this.projectRepository.save(updatedProject);
  }

  async deleteProject(projectId: number): Promise<void> {
    const project = await this.getProjectById(projectId);
    await this.projectRepository.remove(project);
  }
}
