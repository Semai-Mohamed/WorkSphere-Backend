/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CheckPolicies } from 'src/casl/policy/policy.metadata';
import { User } from './user.entity';
import { GetUserId } from 'src/common/user.decorator';
import { UpdateUserDto } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@GetUserId() userId: number) {
    return this.userService.getUser(userId);
  }

  @CheckPolicies('read', User)
  @Get(':userId')
  get(@Param('userId') userId: number) {
    return this.userService.getUser(userId);
  }

  @CheckPolicies('update', User)
  @Patch('update')
  update(@Body() dto: UpdateUserDto, @GetUserId() userId: number) {
    return this.userService.updateUser(userId, dto);
  }
}
