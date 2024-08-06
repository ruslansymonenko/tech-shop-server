import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { ProductService } from '../product/product.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, ConfigService, PrismaService, ProductService],
})
export class OrderModule {}
