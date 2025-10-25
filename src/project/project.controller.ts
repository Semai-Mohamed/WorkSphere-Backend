import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CheckPolicies } from 'src/casl/policy/policy.metadata';
import { WorkSpherPolicyHandler } from 'src/casl/policy/policy.handler';
import { Project } from './project.entity';
import { GetUserId } from 'src/common/user.decorator';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto/project.dto';

@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService
    ){}

    @CheckPolicies('create', Project)
    @Post('add')
    addProject(@Body() dto : CreateProjectDto,@GetUserId() userId : number){
        return this.projectService.addProject(dto,userId)
    }

    @CheckPolicies('read', Project)
    @Get('user/:id')
    getProjectsByUser(@Param('id') userId : number){
        return this.projectService.getProjectsByUser(userId)
    }

    @CheckPolicies('read', Project)
    @Get(':id')
    getProjectById(@Param('id') projectId : number){
        return this.projectService.getProjectById(projectId)
    }

    @CheckPolicies('update', Project)
    @Patch(':id')
    updateProject(@Param('id',ParseIntPipe) projectId : number,@Body() dto : UpdateProjectDto){
        return this.projectService.updateProject(projectId,dto)
    }

    @CheckPolicies('delete', Project)
    @Delete(':id')
    deleteProject(@Param('id') projectId : number){
        return this.projectService.deleteProject(projectId)
    }
}