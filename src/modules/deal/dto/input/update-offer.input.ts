import { InputType, Field, ID, registerEnumType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { EOfferStatus, IMedia } from '../../interface/offer.interface';
import { MediaOfferInput } from '../../models/offer.model';

registerEnumType(EOfferStatus, {
  name: 'EOfferStatus',
});

@InputType()
export class UpdateOfferInput {
  @Field(() => ID, {
    description: 'Offer id',
  })
  @IsNotEmpty()
  id: string;

  @Field(() => EOfferStatus, {
    description: 'Offer status',
    nullable: true,
  })
  status?: EOfferStatus;

  @Field(() => Boolean, {
    description: 'Is offer ready for publishing',
    nullable: true,
  })
  isDraft?: boolean;

  @IsString()
  @MinLength(1, {
    message: (args: ValidationArguments) => {
      return `Too short, minimum length is ${args.constraints[0]} characters`;
    },
  })
  @Field(() => String, {
    description: 'Offer description',
    nullable: true,
  })
  description?: string;

  @Field(() => String, {
    description: 'Offer additional conditions',
    nullable: true,
  })
  additionalConditions?: string;

  @Field(() => Int, {
    description: 'Offer additional conditions',
    nullable: true,
  })
  price?: number;

  @Field(() => String, {
    description: 'Cover for offer',
    nullable: true,
  })
  cover?: string;

  @Field(() => String, {
    description: 'Title of offer',
    nullable: true,
  })
  title?: string;

  @Field(() => [MediaOfferInput], { nullable: true })
  media?: IMedia[];
}
