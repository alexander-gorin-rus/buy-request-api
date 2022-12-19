import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateReportInput {
  @Field(() => String, {
    description: 'User id',
  })
  @IsNotEmpty()
  userId: string;

  @Field(() => String, {
    description: 'Entity id',
  })
  @IsNotEmpty()
  entityId: string;

  @Field(() => String, {
    description: 'Report description',
  })
  @IsNotEmpty()
  description: string;

  @Field(() => String, {
    description: 'Report subject',
  })
  @IsNotEmpty()
  subject: string;
}
