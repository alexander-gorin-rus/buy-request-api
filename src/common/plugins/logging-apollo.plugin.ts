import { Plugin } from '@nestjs/graphql';

import {
  ApolloServerPlugin,
  GraphQLRequestListener,
  GraphQLRequestContextWillSendResponse,
  BaseContext,
} from 'apollo-server-plugin-base';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import winston, { Logger } from 'winston';
import { GraphQLRequestContext } from 'apollo-server-types';

@Plugin()
export class LoggingApolloPlugin implements ApolloServerPlugin {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async requestDidStart(
    requestContext: GraphQLRequestContext<BaseContext>,
  ): Promise<GraphQLRequestListener> {
    this.logger.info(
      `<Graphql> Request started: operationName: ${requestContext.request.operationName},` +
        `  variables: ${JSON.stringify(requestContext.request.variables)}`,
    );
    const log: winston.LeveledLogMethod = this.logger.info;
    return {
      async willSendResponse(
        requestContext: GraphQLRequestContextWillSendResponse<BaseContext>,
      ) {
        log(`<Graphql> Response ${JSON.stringify(requestContext.response)}`);
      },
    };
  }
}
