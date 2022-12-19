import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DefaultDBItem, PaginatedInput } from '../../../common/models';

@ObjectType()
export class Report extends DefaultDBItem {
  @Field(() => ID)
  entityId: string;

  @Field(() => ID)
  userId: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  subject: string;
}

@ObjectType()
export class GetReportsInput extends PaginatedInput {
  @Field(() => [Report])
  data?: Report[];
}
