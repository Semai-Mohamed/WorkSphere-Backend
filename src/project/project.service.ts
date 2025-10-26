import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'node_modules/typeorm';
import { User } from 'src/user/user.entity';
import { UpdateProjectDto,CreateProjectDto } from 'src/dto/project.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project) private readonly projectRepository :Repository<Project>,
        @InjectRepository(User) private readonly userRepository : Repository<User>,
        private readonly caslAbilityFactory : CaslAbilityFactory
    ){}
    
    addProject(dto : CreateProjectDto, userId : number): Promise<Project> {
        const project = this.projectRepository.create({
            ...dto,
            user : {id : userId}
        })
        if(!project) throw new BadRequestException('Cannot create project')
        return this.projectRepository.save(project)
    }

    async getProjectsByUser(userId : number): Promise<Project[]> {
        const projects =await this.projectRepository.find({
            where : {user : {id : userId}},
          
        })
        if(!projects) throw new BadRequestException('Cannot get projects')
        return projects
    }

    async getProjectById(projectId : number): Promise<Project> {
        const project = await this.projectRepository.findOne({
            where : {id : projectId},
            relations : ['user']
        })
        if(!project) throw new BadRequestException('Cannot get project')
        return project
    }

    async updateProject(projectId : number, dto : UpdateProjectDto): Promise<Project> {
        // const ability = this.caslAbilityFactory.createForUser(user);
        const project = await this.getProjectById(projectId)

        const updatedProject = await this.projectRepository.preload({
            id : project.id,
            ...dto
        })
        if(!updatedProject) throw new BadRequestException("cannot update your project")
        return await this.projectRepository.save(updatedProject)
    }

    async deleteProject(projectId : number): Promise<void> {
        const project = await this.getProjectById(projectId)
        if(!project) throw new BadRequestException("cannot delete your project")
        await this.projectRepository.remove(project)
    }
}
