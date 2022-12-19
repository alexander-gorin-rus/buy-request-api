import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UnregisteredUserGuard } from '../unregistered-user-guard';

@Controller('test/method/scoped/unregistered/user/guard')
export class TestMethodScopedUnregisteredUserGuard {
  @Get()
  @UseGuards(UnregisteredUserGuard)
  getHello(): string {
    return 'You are authorized to get this resource';
  }

  @Post()
  setHello(): string {
    return 'You are authorized to post to this resource';
  }
}
