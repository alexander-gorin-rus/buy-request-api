import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcRequestService } from '../../common/services/grpc.request.service';
import {
  IGetUserNotificationsByUserId,
  INotification,
  INotificationServiceClient,
  ISetNotificationByIds,
  SetAllNotificationById,
} from './interface/notification.interface';
import configuration from '../../config/configuration';
import { IIsSuccessResponse, IPaginatedArray } from '../../common/types';

const {
  packageNames: { NOTIFICATION_PACKAGE },
} = configuration();

@Injectable()
export class NotificationService
  extends GrpcRequestService
  implements OnModuleInit, INotificationServiceClient
{
  private notificationService: INotificationServiceClient;

  constructor(
    @Inject(NOTIFICATION_PACKAGE.name) private notificationClient: ClientGrpc,
  ) {
    super(notificationClient);
  }

  onModuleInit(): void {
    this.notificationService =
      this.notificationClient.getService<INotificationServiceClient>(
        NOTIFICATION_PACKAGE.packageName,
      );
  }

  async getUserNotificationsByUserId(data: IGetUserNotificationsByUserId) {
    const result = await this.getResponse<
      IPaginatedArray<INotification>,
      INotificationServiceClient,
      IGetUserNotificationsByUserId
    >(this.notificationService, 'getUserNotificationsByUserId', data);
    return { ...result, data: result.data || [] };
  }

  async setNotificationIsRead(data: ISetNotificationByIds) {
    const { ids } = data;
    return await this.getResponse<
      IIsSuccessResponse,
      INotificationServiceClient,
      ISetNotificationByIds
    >(this.notificationService, 'setNotificationIsRead', {
      ids,
    });
  }

  async setNotificationIsArchive(data: ISetNotificationByIds) {
    const { ids } = data;
    return await this.getResponse<
      IIsSuccessResponse,
      INotificationServiceClient,
      ISetNotificationByIds
    >(this.notificationService, 'setNotificationIsArchive', {
      ids,
    });
  }

  async setAllNotificationIsArchive(data: SetAllNotificationById) {
    const { userId } = data;
    return await this.getResponse<
      IIsSuccessResponse,
      INotificationServiceClient,
      SetAllNotificationById
    >(this.notificationService, 'setAllNotificationIsArchive', {
      userId,
    });
  }

  async setAllNotificationIsRead(data: SetAllNotificationById) {
    const { userId } = data;
    return await this.getResponse<
      IIsSuccessResponse,
      INotificationServiceClient,
      SetAllNotificationById
    >(this.notificationService, 'setAllNotificationIsRead', {
      userId,
    });
  }
}
