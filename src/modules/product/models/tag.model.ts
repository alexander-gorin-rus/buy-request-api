import { Field, ObjectType } from '@nestjs/graphql';
import { DefaultDBItem } from '../../../common/models';

@ObjectType()
export class Tag extends DefaultDBItem {
  @Field(() => String)
  name: string;

  @Field(() => String)
  titleRu: string;

  @Field(() => String)
  titleEn: string;
}

@ObjectType()
export class GetTagsInput {
  @Field(() => [Tag])
  data: Tag[];
}
