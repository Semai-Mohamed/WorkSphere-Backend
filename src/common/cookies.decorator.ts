/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createParamDecorator, ExecutionContext } from "node_modules/@nestjs/common";
import { Request } from "node_modules/@types/express";

export const Cookies = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext) => {
    const request : Request= ctx.switchToHttp().getRequest();
    return cookieName ? request.cookies[cookieName] : request.cookies;
  },
);