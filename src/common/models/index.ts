import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  perPage: number;

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  totalPageCount: number;
}

@ObjectType()
export class PaginatedInput {
  @Field(() => PageInfo)
  pageInfo?: PageInfo;
}

@ObjectType()
export class IsSuccessResponse {
  @Field(() => Boolean)
  isSuccess: boolean;
}

@ObjectType()
export class ErrorInput {
  @Field(() => String)
  code: string;

  @Field(() => [String])
  message: string[];
}

@ObjectType()
export class DefaultDBItem {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  createdAt?: string;

  @Field(() => String)
  updatedAt?: string;
}

@InputType()
export class BaseFilter {
  @Field(() => [SortFilter], {
    nullable: true,
  })
  sort?: SortFilter[];

  @Field(() => Int, {
    nullable: true,
  })
  page?: number;

  @Field(() => Int, {
    nullable: true,
  })
  perPage?: number;
}

@InputType()
export class SortFilter {
  @Field(() => String, {
    nullable: true,
    defaultValue: 'ASC',
  })
  orderBy: 'ASC' | 'DESC';

  @Field(() => String, {
    defaultValue: 'id',
    nullable: true,
  })
  orderName: string;
}

@ObjectType()
export class Media {
  @Field(() => String)
  fileOriginalName: string;

  @Field(() => String)
  mimetype: string;

  @Field(() => String)
  fileNameMinio: string;
}

@InputType()
export class MediaInput {
  @Field(() => String)
  fileOriginalName: string;

  @Field(() => String)
  mimetype: string;

  @Field(() => String)
  fileNameMinio: string;
}
