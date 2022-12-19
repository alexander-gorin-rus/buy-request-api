import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  IRegisterUserResponse,
  IUserServiceClient,
  IUpdateUserResponse,
  IGetUserByClientAccountIdResponse,
  IConsumer,
  ISeller,
  IRegisterConsumerRequest,
  IRegisterSellerRequest,
  IUser,
  IUpdateSellerSettingRequest,
  ICommonIsSuccessResponse,
  IGetCommonUserResponse,
} from './interface/user.interface';
import configuration from '../../config/configuration';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcRequestService } from '../../common/services/grpc.request.service';
import {
  UpdateConsumerInput,
  UpdateConsumerRequest,
  UpdateSellerInput,
  UpdateSellerRequest,
} from './models/user.model';
import { ConfigService } from '@nestjs/config';

const {
  packageNames: { USER_PACKAGE },
} = configuration();

@Injectable()
export class UserService extends GrpcRequestService implements OnModuleInit {
  private userService: IUserServiceClient;

  constructor(
    @Inject(USER_PACKAGE.name) private userClient: ClientGrpc,
    private readonly configService: ConfigService,
  ) {
    super(userClient);
  }

  onModuleInit(): any {
    this.userService = this.userClient.getService<IUserServiceClient>(
      this.configService.get('packageNames').USER_PACKAGE.packageName,
    );
  }

  async getUserByClientAccountId(clientAccountId: string): Promise<IUser> {
    const { user } = await this.getResponse<
      IGetUserByClientAccountIdResponse<IUser>,
      IUserServiceClient,
      { clientAccountId: string }
    >(this.userService, 'getUserByClientAccountId', {
      clientAccountId,
    });
    return user;
  }

  async getUserById<U>(userId: string): Promise<U> {
    const { user } = await this.getResponse<
      IGetCommonUserResponse<U>,
      IUserServiceClient,
      { userId: string }
    >(this.userService, 'getUserById', {
      userId,
    });
    return user;
  }

  async getConsumerByClientAccountId(
    clientAccountId: string,
  ): Promise<IConsumer> {
    const { user } = await this.getResponse<
      IGetUserByClientAccountIdResponse<IConsumer>,
      IUserServiceClient,
      any
    >(this.userService, 'getConsumerByClientAccountId', {
      clientAccountId,
    });
    return user;
  }

  async getSellerByClientAccountId(clientAccountId: string): Promise<ISeller> {
    const { user } = await this.getResponse<
      IGetUserByClientAccountIdResponse<ISeller>,
      IUserServiceClient,
      { clientAccountId: string }
    >(this.userService, 'getSellerByClientAccountId', {
      clientAccountId,
    });
    return user;
  }

  async registerConsumer(
    user: IRegisterConsumerRequest,
  ): Promise<IRegisterUserResponse> {
    return await this.getResponse<
      IRegisterUserResponse,
      IUserServiceClient,
      { user: IRegisterConsumerRequest }
    >(this.userService, 'registerConsumer', {
      user,
    });
  }

  async registerSeller(
    user: IRegisterSellerRequest,
  ): Promise<IRegisterUserResponse> {
    return await this.getResponse<
      IRegisterUserResponse,
      IUserServiceClient,
      { user: IRegisterSellerRequest }
    >(this.userService, 'registerSeller', {
      user,
    });
  }

  async updateConsumer(
    params: UpdateConsumerRequest,
    clientAccountId: string,
  ): Promise<IUpdateUserResponse<IConsumer>> {
    return await this.getResponse<
      IUpdateUserResponse<IConsumer>,
      IUserServiceClient,
      UpdateConsumerInput
    >(this.userService, 'updateConsumer', {
      ...params,
      clientAccountId,
    });
  }

  async updateSeller(
    params: UpdateSellerRequest,
    clientAccountId: string,
  ): Promise<IUpdateUserResponse<ISeller>> {
    return await this.getResponse<
      IUpdateUserResponse<ISeller>,
      IUserServiceClient,
      UpdateSellerInput
    >(this.userService, 'updateSeller', {
      ...params,
      clientAccountId,
    });
  }

  async updateSellerSetting(
    params: IUpdateSellerSettingRequest,
  ): Promise<ICommonIsSuccessResponse> {
    return await this.getResponse<
      ICommonIsSuccessResponse,
      IUserServiceClient,
      IUpdateSellerSettingRequest
    >(this.userService, 'updateSellerSetting', params);
  }
}
