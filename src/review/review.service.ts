import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductService } from '../product/product.service';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getByStoreId(storeId: string) {
    return this.prisma.review.findMany({
      where: {
        storeId,
      },
      include: {
        user: true,
      },
    });
  }

  async getById(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
        userId,
      },
      include: {
        user: true,
      },
    });

    if (!review) throw new NotFoundException('Review not found, or you have no access');

    return review;
  }

  async create(userId: string, storeId: string, productId: string, dto: ReviewDto) {
    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        store: {
          connect: {
            id: storeId,
          },
        },
      },
    });
  }

  async delete(reviewId: string, userId: string) {
    await this.getById(reviewId, userId);

    return this.prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
  }
}
