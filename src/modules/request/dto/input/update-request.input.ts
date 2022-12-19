import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { MediaRequestInput } from '../../models/request.model';
import { IMedia } from '../../../deal/interface/offer.interface';
import { RequestStatus } from '../../interface/request.interface';

@InputType()
export class UpdateRequestInput {
  @Field()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The description of the product that the user want to buy',
    nullable: true,
  })
  description?: string;

  @Field(() => [String], {
    description: 'The list of tags of the product that user want to buy',
    nullable: true,
  })
  tags?: string[];

  @Field(() => String, {
    nullable: true,
  })
  cover?: string;

  @Field(() => String, {
    nullable: true,
  })
  title?: string;

  @Field(() => Boolean, {
    nullable: true,
  })
  delete?: boolean;

  @Field(() => [MediaRequestInput], { nullable: true })
  media?: IMedia[];

  @Field(() => [String], { nullable: true })
  products?: string[];

  @Field(() => Number, { nullable: true })
  budget?: number;

  @Field(() => RequestStatus, {
    nullable: true,
    description: 'Request status',
  })
  status?: RequestStatus;
}
