import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { ClientsModule } from '@nestjs/microservices';
import configuration from '../../config/configuration';
import { ConfigService } from '@nestjs/config';
import { RequestModule } from '../request/request.module';
import { DealService } from '../deal/deal.service';
import { SellerResolver } from './seller.resolver';
import { ConsumerResolver } from './consumer.resolver';
import { NotificationService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';
import { ProductService } from '../product/product.service';
import { ProductModule } from '../product/product.module';
import { RatingService } from '../rating/rating.service';
import { RatingModule } from '../rating/rating.module';
import { ReportModule } from '../report/report.module';
import { ReportService } from '../report/report.service';
import { OfferService } from '../deal/offer.service';
import { AuthService } from '../auth/auth.service';
import { HttpModule } from '@nestjs/axios';

const { clients } = configuration();

@Module({
  imports: [
    ClientsModule.register(clients),
    RequestModule,
    NotificationModule,
    ProductModule,
    RatingModule,
    ReportModule,
    HttpModule,
  ],
  providers: [
    UserService,
    UserResolver,
    SellerResolver,
    ConsumerResolver,
    DealService,
    ConfigService,
    NotificationService,
    OfferService,
    ProductService,
    RatingService,
    ReportService,
    AuthService,
  ],
  exports: [UserService],
})
export class UserModule {}
