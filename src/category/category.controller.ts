import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth()
  @Get('by-storeId/:storeId')
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.categoryService.getByStoreId(storeId);
  }

  @Auth()
  @Get('by-id/:categoryId')
  async getById(@Param('categoryId') categoryId: string) {
    return this.categoryService.getById(categoryId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('create/:storeId')
  async create(@Param('storeId') storeId: string, @Body() dto: CategoryDto) {
    return this.categoryService.create(storeId, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('update/:categoryId')
  async update(@Param('categoryId') categoryId: string, @Body() dto: CategoryDto) {
    return this.categoryService.update(categoryId, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete('delete/:categoryId')
  async delete(@Param('categoryId') colorId: string) {
    return this.categoryService.delete(colorId);
  }
}
