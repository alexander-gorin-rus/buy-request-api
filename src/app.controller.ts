import { Controller, Get } from '@nestjs/common';
import { collectDefaultMetrics } from 'prom-client';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

collectDefaultMetrics();

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private config: ConfigService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
