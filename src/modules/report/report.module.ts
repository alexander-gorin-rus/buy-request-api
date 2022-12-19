import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import configuration from '../../config/configuration';
import { ConfigService } from '@nestjs/config';
import { ReportService } from './report.service';
import { ReportResolver } from './report.resolver';

const { clients } = configuration();

@Module({
  imports: [ClientsModule.register(clients)],
  providers: [ConfigService, ReportService, ReportResolver],
  exports: [ReportService],
})
export class ReportModule {}
