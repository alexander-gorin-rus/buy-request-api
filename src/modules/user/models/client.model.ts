import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LocaleTypes, UserType } from '../interface/user.interface';
import { DefaultDBItem } from '../../../common/models';

registerEnumType(UserType, {
  name: 'UserType',
});

@ObjectType()
export class Client extends DefaultDBItem {
  @Field(() => UserType)
  type: UserType;

  @Field(() => String)
  name: string;

  @Field(() => String)
  surname: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  avatar: string;

  @Field(() => String)
  locale: LocaleTypes;
}
