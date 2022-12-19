import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IMedia, ProductStatus } from '../../interface/product.interface';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { MediaInput } from '../../../../common/models';

registerEnumType(ProductStatus, {
  name: 'ProductStatus',
});

@InputType()
export class CreateProductInput {
  @Field(() => String, {
    description: 'Who made the product',
  })
  @IsNotEmpty()
  production: string;

  @Field(() => String, {
    description: 'User id',
  })
  @IsNotEmpty()
  userId: string;

  @Field(() => String, {
    description: 'Product name',
  })
  @IsNotEmpty()
  name: string;

  @Field(() => String, {
    description: 'Guarantee period',
  })
  @IsNotEmpty()
  productionGuarantee: string;

  @Field(() => String, {
    description: 'Product model',
  })
  @IsNotEmpty()
  model: string;

  @Field(() => [String], {
    description: 'Product category',
  })
  @IsNotEmpty()
  tags: string[];

  @Field(() => String, {
    description: 'Product description',
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

  @Field(() => [MediaInput], {
    description: 'Product video or photo',
  })
  @IsNotEmpty()
  media: IMedia[];

  @Field(() => String, {
    description: 'Cover photo',
  })
  @IsNotEmpty()
  cover: string;

  @Field(() => ProductStatus, {
    nullable: true,
    description: 'Product status',
  })
  status?: ProductStatus;
}
