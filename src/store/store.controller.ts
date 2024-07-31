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
import { StoreService } from './store.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorators';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Auth()
  @Get('by-id/:id')
  async getById(@Param('id') storeId: string, @CurrentUser('id') userId: string) {
    return this.storeService.getById(storeId, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('create')
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateStoreDto) {
    return this.storeService.create(userId, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('update/:id')
  async update(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.storeService.update(storeId, userId, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete('delete/:id')
  async delete(@Param('id') storeId: string, @CurrentUser('id') userId: string) {
    return this.storeService.delete(storeId, userId);
  }
}
