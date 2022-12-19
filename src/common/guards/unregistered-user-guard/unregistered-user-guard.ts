import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ContextTypes } from '../../types';
import { checkIfThereIsATokenInCookies } from './helpers';

@Injectable()
export class UnregisteredUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() === ContextTypes.HTTP) {
      // do something that is only important in the context of regular HTTP requests (REST)
      const request: Request = context.switchToHttp().getRequest<Request>();
      return checkIfThereIsATokenInCookies(request);
    } else if (context.getType<GqlContextType>() === ContextTypes.GQL) {
      // do something that is only important in the context of GraphQL requests
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();
      return checkIfThereIsATokenInCookies(req);
    }
  }
}
