import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStoreDto } from '../store/dto/create-store.dto';
import { UpdateStoreDto } from '../store/dto/update-store.dto';
import { ColorDto } from './dto/color.dto';

@Injectable()
export class ColorService {
  constructor(private prisma: PrismaService) {}

  async getByStoreId(storeId: string) {
    return this.prisma.color.findMany({
      where: {
        storeId,
      },
    });
  }

  async getById(colorId: string) {
    const color = await this.prisma.color.findUnique({
      where: {
        id: colorId,
      },
    });

    if (!color) throw new NotFoundException('Color not found');

    return color;
  }

  async create(storeId: string, dto: ColorDto) {
    return this.prisma.color.create({
      data: {
        title: dto.title,
        value: dto.value,
        storeId,
      },
    });
  }

  async update(storeId: string, dto: ColorDto) {
    await this.getById(storeId);

    return this.prisma.color.update({
      where: {
        id: storeId,
      },
      data: dto,
    });
  }

  async delete(colorId: string) {
    await this.getById(colorId);

    return this.prisma.color.delete({
      where: {
        id: colorId,
      },
    });
  }
}
