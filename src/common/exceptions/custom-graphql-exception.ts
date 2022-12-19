import { ApolloError } from 'apollo-server-errors';
import { ErrorStatusGrpc } from './exception-factory/types';

export class GraphError extends ApolloError {
  constructor(message: string) {
    super(message, ErrorStatusGrpc[message]);
  }
}
