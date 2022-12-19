import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import configuration from '../../config/configuration';
import { RatingResolver } from './rating.resolver';
import { RatingService } from './rating.service';

const { clients } = configuration();

@Module({
  imports: [ClientsModule.register(clients)],
  providers: [RatingService, RatingResolver],
  exports: [RatingService],
})
export class RatingModule {}
