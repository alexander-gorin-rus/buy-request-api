import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import configuration from '../../config/configuration';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { DealService } from '../deal/deal.service';
import { OfferService } from '../deal/offer.service';
import { RequestService } from '../request/request.service';

const { clients } = configuration();

@Module({
  imports: [ClientsModule.register(clients)],
  providers: [
    NotificationService,
    NotificationResolver,
    DealService,
    OfferService,
    RequestService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
