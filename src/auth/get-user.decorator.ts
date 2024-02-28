import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    // ! First line is necessary (else undefined)
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
