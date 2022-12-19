import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class GetRequestsArgs {
  @Field()
  @IsNotEmpty()
  requestId: string;
}
