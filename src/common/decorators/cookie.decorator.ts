import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ContextTypes } from '../types';

export const Cookie = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    if (ctx.getType() === ContextTypes.HTTP) {
      const request = ctx.switchToHttp().getRequest();
      return data ? request.cookies?.[data] : request.cookies;
    } else if (ctx.getType<GqlContextType>() === ContextTypes.GQL) {
      const gqlctx = GqlExecutionContext.create(ctx);
      const { req } = gqlctx.getContext();
      return data ? req.cookies?.[data] : req.cookies;
    }
  },
);
