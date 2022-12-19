import { InputType, Int, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { EOfferStatus, IMedia } from '../../interface/offer.interface';
import { MediaOfferInput } from '../../models/offer.model';

registerEnumType(EOfferStatus, {
  name: 'EOfferStatus',
});

@InputType()
export class CreateOfferInput {
  @Field(() => ID, {
    description: 'ID of request to wich the offer is being made',
  })
  @IsNotEmpty()
  requestId: string;

  @Field(() => String, {
    description: 'Product Id',
  })
  @IsNotEmpty()
  productId: string;

  @Field(() => Int, {
    description: 'Offer price',
  })
  @IsNotEmpty()
  price: number;

  @Field(() => String, {
    description: 'Offer description',
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

  @Field(() => String, {
    nullable: true,
    description: 'Offer additional conditions',
  })
  additionalConditions?: string;

  @Field(() => Boolean, {
    description: 'Is the product eco-friendly',
    nullable: true,
    defaultValue: false,
  })
  ecogood: boolean;

  @Field(() => Boolean, {
    description: 'Is offer ready for publishing',
  })
  @IsNotEmpty()
  isDraft: boolean;

  @Field(() => EOfferStatus, {
    description: 'Is offer ready for publishing',
    defaultValue: 'CREATED',
  })
  @IsNotEmpty()
  status: EOfferStatus;

  @Field(() => String, {
    description: 'Cover for offer',
    nullable: true,
  })
  cover?: string;

  @Field(() => String, {
    description: 'Cover for offer',
    nullable: true,
  })
  title?: string;

  @Field(() => [MediaOfferInput], { nullable: true })
  media?: IMedia[];
}
