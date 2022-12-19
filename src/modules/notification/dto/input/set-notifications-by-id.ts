import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsArray } from 'class-validator';

@InputType()
export class GetIdsInput {
  @Field(() => [String], {
    description: 'The list ids of notifications to be set as read',
  })
  @IsArray()
  @IsNotEmpty()
  ids: string[];
}
