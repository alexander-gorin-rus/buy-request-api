import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestResolver } from './request.resolver';
import { UserService } from '../user/user.service';
import { RatingService } from '../rating/rating.service';
import { ClientsModule } from '@nestjs/microservices';
import configuration from '../../config/configuration';
import { ProductService } from '../product/product.service';
import { TagService } from '../product/tag.service';

const { clients } = configuration();

@Module({
  imports: [ClientsModule.register(clients)],
  providers: [
    RequestResolver,
    RequestService,
    UserService,
    RatingService,
    ProductService,
    TagService,
  ],
  exports: [RequestService],
})
export class RequestModule {}
