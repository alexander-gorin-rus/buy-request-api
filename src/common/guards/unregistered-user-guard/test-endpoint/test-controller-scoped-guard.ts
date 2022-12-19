import { Controller, Get, UseGuards } from '@nestjs/common';
import { UnregisteredUserGuard } from '../unregistered-user-guard';

@Controller('test/controller/scoped/unregistered/user/guard')
@UseGuards(UnregisteredUserGuard)
export class TestControllerScopedUnregisteredUserGuard {
  @Get()
  getHello(): string {
    return 'You are authorized to get this resource';
  }
}
