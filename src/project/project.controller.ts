import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CheckPolicies } from 'src/casl/policy/policy.metadata';
import { WorkSpherPolicyHandler } from 'src/casl/policy/policy.handler';
import { Project } from './project.entity';
import { CreateProjectDto } from 'src/dto/notification.dto';
import { GetUserId } from 'src/common/user.decorator';
import { UpdateProjectDto } from 'src/dto/project.dto';

@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService
    ){}

    @CheckPolicies(new WorkSpherPolicyHandler('create',Project))
    @Post('add')
    addProject(@Body() dto : CreateProjectDto,@GetUserId() userId : number){
        return this.projectService.addProject(dto,userId)
    }

    @CheckPolicies(new WorkSpherPolicyHandler('read',Project))
    @Get('user/:id')
    getProjectsByUser(@Param('id') userId : number){
        return this.projectService.getProjectsByUser(userId)
    }

    @CheckPolicies(new WorkSpherPolicyHandler('read',Project))
    @Get(':id')
    getProjectById(@Param('id') projectId : number){
        return this.projectService.getProjectById(projectId)
    }

    @CheckPolicies(new WorkSpherPolicyHandler('update',Project))
    @Patch(':id')
    updateProject(@Param('id') projectId : number,@Body() dto : UpdateProjectDto){
        return this.projectService.updateProject(projectId,dto)
    }

    @CheckPolicies(new WorkSpherPolicyHandler('delete',Project))
    @Delete(':id')
    deleteProject(@Param('id') projectId : number){
        return this.projectService.deleteProject(projectId)
    }
}