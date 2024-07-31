import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsString({
    message: 'Please enter a valid product name',
  })
  @IsNotEmpty({
    message: 'Please enter a valid product name',
  })
  title: string;

  @IsString({
    message: 'Please enter a valid product description',
  })
  @IsNotEmpty({
    message: 'Please enter a valid product description',
  })
  description: string;

  @IsNumber({}, { message: 'Please enter a valid product price number' })
  @IsNotEmpty({
    message: 'Please enter a valid product price',
  })
  price: number;

  @ArrayMinSize(1, { message: 'Please add at least one image' })
  @IsNotEmpty({
    each: true,
    message: 'Please add at least one image',
  })
  images: string[];

  @IsString({ message: 'Please enter a valid product category' })
  @IsNotEmpty({
    message: 'Please enter a valid product category',
  })
  categoryId: string;

  @IsString({ message: 'Please enter a valid product color' })
  @IsNotEmpty({
    message: 'Please enter a valid product color',
  })
  colorId: string;
}
