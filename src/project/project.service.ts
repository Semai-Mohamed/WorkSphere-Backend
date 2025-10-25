import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'node_modules/typeorm';
import { User } from 'src/user/user.entity';
import { CreateProjectDto } from 'src/dto/notification.dto';
import { UpdateProjectDto } from 'src/dto/project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project) private readonly projectRepository :Repository<Project>,
        @InjectRepository(User) private readonly userRepository : Repository<User>
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
            relations : ['user']
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
        await this.projectRepository.remove(project)
    }
}
