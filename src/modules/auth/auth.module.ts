import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientsModule } from '@nestjs/microservices';
import configuration from '../../config/configuration';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

const { clients } = configuration();

@Module({
  imports: [ClientsModule.register(clients), HttpModule],
  providers: [AuthService, UserService, ConfigService, TokenService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
