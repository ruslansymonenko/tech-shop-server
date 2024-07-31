import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ColorDto } from '../color/dto/color.dto';
import { ProductDto } from './dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.productService.getAll(searchTerm);
  }

  @Auth()
  @Get('by-storeId/:storeId')
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.productService.getByStoreId(storeId);
  }

  @Get('by-id/:productId')
  async getById(@Param('id') id: string) {
    return this.productService.getAll(id);
  }

  @Get('by-category/:categoryId')
  async getByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getByCategory(categoryId);
  }

  @Get('most-popular')
  async getMostPopular() {
    return this.productService.getMostPopular();
  }

  @Get('by-similar/:productId')
  async getSimilar(@Param('productId') productId: string) {
    return this.productService.getSimilar(productId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('create/:storeId')
  async create(@Param('storeId') storeId: string, @Body() dto: ProductDto) {
    return this.productService.create(storeId, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('update/:productId')
  async update(@Param('productId') productId: string, @Body() dto: ProductDto) {
    return this.productService.update(productId, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete('delete/:productId')
  async delete(@Param('productId') productId: string) {
    return this.productService.delete(productId);
  }
}
