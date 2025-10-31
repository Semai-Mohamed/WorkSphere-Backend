/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadGatewayException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { RequestWithUser } from 'src/dto/auth.dto';

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: RequestWithUser = ctx.switchToHttp().getRequest();
    if (request.user.id) {
      return request.user?.id;
    } else {
      throw new BadGatewayException('Invalid userId');
    }
  },
);
