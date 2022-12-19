import { Field, ID, ObjectType, InputType, Int, Float } from '@nestjs/graphql';
import { DefaultDBItem, PaginatedInput } from '../../../common/models';

@ObjectType()
export class Rating extends DefaultDBItem {
  @Field(() => ID)
  entityId: string;

  @Field(() => String)
  entityName: string;

  @Field(() => String)
  authorId: string;

  @Field(() => Int)
  value: number;

  @Field(() => String, { nullable: true })
  comment?: string;
}

@InputType()
export class CreateRatingRequest {
  @Field(() => ID)
  entityId: string;

  @Field(() => String)
  entityName: string;

  @Field(() => Int)
  value: number;

  @Field(() => String, { nullable: true })
  comment: string;
}

@ObjectType()
export class GetRatingsResponse extends PaginatedInput {
  @Field(() => [Rating], { nullable: true })
  data?: Rating[];

  @Field(() => Float, { nullable: true })
  userRating?: number;
}
