import {
  IDefaultDBItem,
  IIsSuccessResponse,
  IPaginatedArray,
  ISort,
} from '../../../common/types';

export enum NotificationType {
  NEW_REQUEST_CREATED = 'NEW_REQUEST_CREATED',
  NEW_OFFER_CREATED = 'NEW_OFFER_CREATED',
  NEW_DEAL_CREATED = 'NEW_DEAL_CREATED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  DEAL_PAID = 'DEAL_PAID',
  DEAL_CANCELED = 'DEAL_CANCELED',
  DEAL_COMPLETED = 'DEAL_COMPLETED',
  DEAL_CUSTOMER_PAID = 'DEAL_CUSTOMER_PAID',
  DEAL_DISPUTE = 'DEAL_DISPUTE',
  OFFER_CANCELED = 'OFFER_CANCELED',
  OFFER_CONFIRMED = 'OFFER_CONFIRMED',
}

export interface INotification extends IDefaultDBItem {
  userId: string;
  message: string;
  type: NotificationType;
  subjectId: string;
  isRead: boolean;
}

export enum notificationSubject {
  REQUEST = 'REQUEST',
  OFFER = 'OFFER',
  DEAL = 'DEAL',
}

export const notificationTypeToSubject = {
  [NotificationType.NEW_REQUEST_CREATED]: notificationSubject.REQUEST,
  [NotificationType.NEW_OFFER_CREATED]: notificationSubject.OFFER,
  [NotificationType.OFFER_CANCELED]: notificationSubject.OFFER,
  [NotificationType.OFFER_CONFIRMED]: notificationSubject.OFFER,
  [NotificationType.DEAL_CANCELED]: notificationSubject.DEAL,
  [NotificationType.DEAL_COMPLETED]: notificationSubject.DEAL,
  [NotificationType.DEAL_DISPUTE]: notificationSubject.DEAL,
  [NotificationType.DEAL_PAID]: notificationSubject.DEAL,
  [NotificationType.DEAL_CUSTOMER_PAID]: notificationSubject.DEAL,
  [NotificationType.NEW_DEAL_CREATED]: notificationSubject.DEAL,
};

export interface INotificationServiceClient {
  getUserNotificationsByUserId(
    data: IGetUserNotificationsByUserId,
  ): Promise<IPaginatedArray<INotification>>;

  setNotificationIsRead(
    ids: ISetNotificationByIds,
  ): Promise<IIsSuccessResponse>;

  setNotificationIsArchive(
    ids: ISetNotificationByIds,
  ): Promise<IIsSuccessResponse>;
}

export interface IGetUserNotificationsByUserId {
  userId: string;
  page?: number;
  perPage?: number;
  isRead?: boolean;
  sort?: ISort[];
  types?: NotificationType[];
  periodTime?: number;
  archive?: boolean;
}
export interface ISetNotificationByIds {
  ids: string[];
}

export interface SetAllNotificationById {
  userId: string;
}
