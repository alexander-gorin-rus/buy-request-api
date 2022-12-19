import {
  ObjectType,
  ID,
  Field,
  Int,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  BaseFilter,
  DefaultDBItem,
  Media,
  MediaInput,
  PaginatedInput,
} from '../../../common/models';
import { IMedia } from '../../deal/interface/offer.interface';
import { RequestStatus } from '../interface/request.interface';
import { Tag } from '../../product/models/tag.model';
import { ITag } from '../../product/interface/tag.interface';

@ObjectType()
export class PageRequest extends PaginatedInput {
  @Field(() => [Request])
  data?: [Request];
}

registerEnumType(RequestStatus, {
  name: 'RequestStatus',
});

@ObjectType()
export class Request extends DefaultDBItem {
  @Field(() => ID)
  userId: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  budget: number;

  @Field(() => [String])
  tags: string[];

  @Field(() => Boolean)
  readyForAnalogues: boolean;

  @Field(() => String, { defaultValue: '' })
  cover: string;

  @Field(() => String)
  title: string;

  @Field(() => [MediaRequest], { nullable: true })
  media?: IMedia[];

  @Field(() => RequestStatus)
  status?: RequestStatus;

  @Field(() => [Tag])
  tagsData?: ITag[];
}

@ObjectType()
export class RequestAuthor {
  @Field(() => String)
  name: string;

  @Field(() => String)
  surname: string;

  @Field(() => String)
  avatar: string;
}

@ObjectType()
export class MediaRequest extends Media {
  @Field(() => String, {
    nullable: true,
  })
  bucket?: 'request' | 'product';
}

@InputType()
export class MediaRequestInput extends MediaInput {
  @Field(() => String)
  bucket: 'request' | 'product';
}

@InputType()
export class RequestFilterInput extends BaseFilter {
  @Field(() => String, { nullable: true })
  requestId?: string;

  @Field(() => [RequestStatus], { nullable: true, defaultValue: 'IN_PROGRESS' })
  statuses?: RequestStatus[];
}
