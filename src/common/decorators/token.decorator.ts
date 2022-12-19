import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { ContextTypes } from '../types';

export const Token = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    if (ctx.getType() === ContextTypes.HTTP) {
      const request = ctx.switchToHttp().getRequest();
      const tokenData = jwt.decode(request.cookies?.token);
      return data ? tokenData[data] : request.cookies;
    } else if (ctx.getType<GqlContextType>() === ContextTypes.GQL) {
      const gqlctx = GqlExecutionContext.create(ctx);
      const { req } = gqlctx.getContext();
      const tokenData = jwt.decode(req.cookies?.token);
      return data ? tokenData[data] : req.cookies;
    }
  },
);
