import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteRequestInput {
  @Field()
  @IsNotEmpty()
  requestId: string;
}
