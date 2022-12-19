import { Module } from '@nestjs/common';
import { LoggingApolloPlugin } from './plugins/logging-apollo.plugin';

@Module({
  providers: [LoggingApolloPlugin],
  exports: [],
})
export class CommonModule {}
