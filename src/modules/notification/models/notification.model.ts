import {
  ObjectType,
  ID,
  Field,
  registerEnumType,
  InputType,
  Int,
} from '@nestjs/graphql';
import {
  BaseFilter,
  DefaultDBItem,
  PaginatedInput,
} from '../../../common/models';
import { NotificationType } from '../interface/notification.interface';

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

@ObjectType()
export class PageNotification extends PaginatedInput {
  @Field(() => [Notification])
  data?: Notification[] | [];
}

@ObjectType()
export class Notification extends DefaultDBItem {
  @Field(() => ID)
  readonly userId: string;

  @Field(() => String)
  readonly message: string;

  @Field(() => NotificationType)
  readonly type: NotificationType;

  @Field(() => ID)
  readonly subjectId: string;

  @Field(() => Boolean)
  readonly isRead: boolean;

  @Field(() => Boolean)
  readonly archive: boolean;
}

@InputType()
export class NotificationFilterInput extends BaseFilter {
  @Field(() => [NotificationType], { nullable: true })
  types?: [NotificationType];

  @Field(() => Int, { nullable: true })
  periodTime?: number;

  @Field(() => Boolean, { nullable: true })
  isRead?: boolean;

  @Field(() => Boolean, { nullable: true })
  archive?: boolean;
}
