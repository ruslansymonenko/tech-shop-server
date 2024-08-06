import { EnumOrderStatus } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus, {
    message: 'Order status is required',
  })
  status: EnumOrderStatus;

  @IsArray({
    message: 'No goods in the order',
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsNumber({}, { message: 'Please enter a valid product item quantity' })
  quantity: number;

  @IsNumber({}, { message: 'Please enter a valid product price' })
  price: number;

  @IsString({ message: 'Please enter a valid product id' })
  productId: string;

  @IsString({ message: 'Please enter a valid store id' })
  storeId: string;
}
