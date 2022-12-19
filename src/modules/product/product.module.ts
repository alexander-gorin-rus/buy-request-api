import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import configuration from '../../config/configuration';
import { ConfigService } from '@nestjs/config';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { RatingService } from '../rating/rating.service';

const { clients } = configuration();

@Module({
  imports: [ClientsModule.register(clients)],
  providers: [
    TagService,
    TagResolver,
    ConfigService,
    RatingService,
    ProductService,
    ProductResolver,
  ],
  exports: [TagService],
})
export class ProductModule {}
