/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CheckPolicies } from 'src/casl/policy/policy.metadata';
import { WorkSpherPolicyHandler } from 'src/casl/policy/policy.handler';
import { User } from './user.entity';
import { GetUserId } from 'src/common/user.decorator';
import type { RequestWithUser } from 'src/dto/auth.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService){}
    

    @Get('profile')
    getProfile(@Req() req : RequestWithUser){
        return req.user
    }

    @CheckPolicies(new WorkSpherPolicyHandler('read',User))
    @Get('read')
    get(@GetUserId() userId : number){
        return this.userService.getUser(userId)
    }
    
    @CheckPolicies(new WorkSpherPolicyHandler('update',User))
    @Patch('update')
    update(@Body() dto : any , @GetUserId() userId : number){
        return this.userService.updateUser(userId,dto)
    }

}
