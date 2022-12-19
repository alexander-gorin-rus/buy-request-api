import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsArray,
  MinLength,
  MaxLength,
  ValidationArguments,
  IsString,
} from 'class-validator';
import { IMedia } from '../../../deal/interface/offer.interface';
import { MediaRequestInput } from '../../models/request.model';
import { RequestStatus } from '../../interface/request.interface';

@InputType()
export class CreateRequestInput {
  @Field(() => String, {
    description: 'The description of the product that the user want to buy',
  })
  @IsString()
  @MinLength(1, {
    message: (args: ValidationArguments) => {
      return `Too short, minimum length is ${args.constraints[0]} characters`;
    },
  })
  @MaxLength(255, {
    message: (args: ValidationArguments) => {
      return `Too long text ${args.constraints[0]} characters`;
    },
  })
  description: string;

  @Field(() => Int, { description: 'The budget that the user can pay' })
  @IsNotEmpty()
  budget: number;

  @Field(() => [String])
  products: string[];

  @Field(() => Boolean)
  @IsNotEmpty()
  isDraft: boolean;

  @Field(() => [String], {
    description: 'The list of tags of the product that user want to buy',
  })
  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @Field(() => Boolean, {
    defaultValue: false,
  })
  readyForAnalogues: boolean;

  @Field(() => String, {
    defaultValue: '',
  })
  cover: string;

  @Field(() => String)
  title: string;

  @Field(() => [MediaRequestInput], { nullable: true })
  media?: IMedia[];

  @Field(() => RequestStatus, {
    nullable: true,
    description: 'Request status',
    defaultValue: RequestStatus.DEFAULT_IN_PROGRESS,
  })
  status?: RequestStatus;
}
