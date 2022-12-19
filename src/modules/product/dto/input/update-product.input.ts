import { InputType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { IMedia, ProductStatus } from '../../interface/product.interface';
import { MediaInput } from '../../../../common/models';

registerEnumType(ProductStatus, {
  name: 'ProductStatus',
});

@InputType()
export class UpdateProductInput {
  @Field(() => ID, {
    description: 'Product id',
  })
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'User id',
  })
  @IsNotEmpty()
  userId: string;

  @Field(() => String, {
    description: 'Product name',
    nullable: true,
  })
  name: string;

  @IsString()
  @MinLength(1, {
    message: (args: ValidationArguments) => {
      return `Too short, minimum length is ${args.constraints[0]} characters`;
    },
  })
  @Field(() => String, {
    description: 'Product description',
    nullable: true,
  })
  description: string;

  @Field(() => [MediaInput], {
    nullable: true,
    description: 'Product video or photo',
  })
  media?: IMedia[];

  @Field(() => String, {
    description: 'Cover photo',
    nullable: true,
  })
  cover: string;

  @Field(() => String, {
    description: 'Production',
    nullable: true,
  })
  production: string;

  @Field(() => String, {
    description: 'Guarantee period',
    nullable: true,
  })
  productionGuarantee: string;

  @Field(() => [String], {
    description: 'Product category',
    nullable: true,
  })
  tags: string[];

  @Field(() => String, {
    description: 'Product model',
    nullable: true,
  })
  model: string;

  @Field(() => ProductStatus, {
    nullable: true,
    description: 'Product status',
  })
  status?: ProductStatus;
}
