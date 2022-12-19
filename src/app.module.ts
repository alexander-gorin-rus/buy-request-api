import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import configuration from './config/configuration';
import { UserModule } from './modules/user/user.module';
import { DealModule } from './modules/deal/deal.module';
import { ClientsModule } from '@nestjs/microservices';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { CommonModule } from './common/common.module';
import * as winston from 'winston';
import { AuthModule } from './modules/auth/auth.module';
import { AmqpModule } from './amqp/amqp.module';
import { AmqpService } from './amqp/amqp.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RequestModule } from './modules/request/request.module';
import { ProductModule } from './modules/product/product.module';
import { NotificationModule } from './modules/notification/notification.module';
import { RatingModule } from './modules/rating/rating.module';
import { ReportModule } from './modules/report/report.module';
import { HttpModule } from '@nestjs/axios';
import { MinioClientModule } from './modules/minio-client/minio-client.module';
import { FilesModule } from './modules/files/files.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

const { allowedOrigins, clients, applicationName, amqp } = configuration();

@Module({
  imports: [
    ClientsModule.register(clients),
    GraphQLModule.forRoot({
      cors: {
        credentials: true,
        origin: allowedOrigins,
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            error?.extensions?.exception?.response?.message || error?.message,
        };
        return graphQLFormattedError;
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(applicationName, {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    RabbitMQModule.forRoot(RabbitMQModule, amqp.config),
    AmqpModule,
    UserModule,
    DealModule,
    AuthModule,
    ProductModule,
    CommonModule,
    RequestModule,
    NotificationModule,
    RatingModule,
    ReportModule,
    HttpModule,
    MinioClientModule,
    FilesModule,
  ],
  controllers: [AppController],
  exports: [AmqpModule, AmqpService, AppModule],
  providers: [AppService, AmqpService],
})
export class AppModule {}
