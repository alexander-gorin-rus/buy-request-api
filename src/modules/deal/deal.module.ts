import { Module } from '@nestjs/common';
import { DealService } from './deal.service';
import { DealResolver } from './deal.resolver';
import { ClientsModule } from '@nestjs/microservices';
import configuration from '../../config/configuration';
import { OfferService } from './offer.service';
import { OfferResolver } from './offer.resolver';
import { RequestService } from '../request/request.service';
import { ProductService } from '../product/product.service';
import { RatingService } from '../rating/rating.service';
import { UserService } from '../user/user.service';

const { clients } = configuration();

@Module({
  imports: [ClientsModule.register(clients)],
  providers: [
    DealService,
    DealResolver,
    OfferService,
    ProductService,
    OfferResolver,
    RequestService,
    RatingService,
    UserService,
  ],
  exports: [DealService, OfferService, ProductService],
})
export class DealModule {}
