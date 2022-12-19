import {
  Field,
  ID,
  ObjectType,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import { LocaleTypes, UserType } from '../interface/user.interface';
import { PageRequest } from '../../request/models/request.model';
import { PageNotification } from '../../notification/models/notification.model';
import { GetProductsInput } from '../../product/models/product.model';
import { GetRatingsResponse } from '../../rating/models/rating.model';
import { GetReportsInput } from '../../report/models/report.model';
import { GetOffersResponseInput } from '../../deal/models/offer.model';
import { DefaultDBItem } from '../../../common/models';

registerEnumType(UserType, {
  name: 'UserType',
});

@ObjectType()
export class User extends DefaultDBItem {
  @Field(() => ID)
  clientAccountId: string;

  @Field(() => ID)
  userId: string;

  @Field(() => UserType)
  type: UserType;

  @Field(() => String)
  name: string;

  @Field(() => String)
  surname: string;

  @Field(() => String)
  userName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  locale: LocaleTypes;

  @Field(() => PageRequest, { nullable: true })
  requests?: PageRequest;

  @Field(() => PageNotification, { nullable: true })
  notifications?: PageNotification;

  @Field(() => GetOffersResponseInput, { nullable: true })
  offers?: GetOffersResponseInput;

  @Field(() => GetProductsInput, { nullable: true })
  products?: GetProductsInput;

  @Field(() => GetRatingsResponse, { nullable: true })
  ratings?: GetRatingsResponse;

  @Field(() => GetReportsInput, { nullable: true })
  reports?: GetReportsInput;

  @Field(() => String, { nullable: true })
  avatar?: string;
}

@ObjectType()
export class Consumer extends User {}

@ObjectType()
export class Setting {
  @Field(() => ID)
  id: string;

  @Field(() => [String], { nullable: true })
  tags: string[] | [];

  @Field(() => Boolean)
  emails: boolean;
}

@ObjectType()
export class Seller extends User {
  @Field(() => String)
  company: string;

  @Field(() => Setting)
  setting: Setting;
}

@ObjectType()
export class UpdateConsumerResponse {
  @Field(() => Consumer)
  user: Consumer;
}

@ObjectType()
export class UpdateSellerResponse {
  @Field(() => Seller)
  user: Seller;
}

@ObjectType()
export class UpdateSellerSettingResponse {
  @Field(() => Setting)
  setting: Setting;
}

@InputType()
export class RegisterUserRequest {
  @Field(() => UserType)
  type: UserType;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  surname: string;

  @Field(() => String)
  userName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  locale: LocaleTypes;
}

@InputType()
export class RegisterConsumerRequest extends RegisterUserRequest {}

@InputType()
export class RegisterSellerRequest extends RegisterUserRequest {
  @Field(() => String)
  company: string;
}

@InputType()
export class UpdateUserRequest {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  surname: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => String, { nullable: true })
  userName: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  oldPassword?: string;

  @Field(() => String, { nullable: true })
  newPassword?: string;

  @Field(() => String, { nullable: true })
  locale?: LocaleTypes;
}

@InputType()
export class UpdateConsumerInput extends UpdateUserRequest {
  @Field(() => ID)
  clientAccountId: string;
}

@InputType()
export class UpdateSellerSettingRequest {
  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => Boolean, { nullable: true })
  emails: boolean;
}

@InputType()
export class UpdateConsumerRequest extends UpdateUserRequest {}

@InputType()
export class UpdateSellerInput extends UpdateUserRequest {
  @Field(() => ID)
  clientAccountId: string;
}

@InputType()
export class UpdateSellerRequest extends UpdateUserRequest {
  @Field(() => String)
  company: string;
}

@ObjectType()
export class SignInRequest {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
