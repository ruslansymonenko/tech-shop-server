import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ColorDto } from '../color/dto/color.dto';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) return this.getSearchTermFilter(searchTerm);

    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        color: true,
        reviews: true,
      },
    });

    return products;
  }

  async getByStoreId(storeId: string) {
    return this.prisma.product.findMany({
      where: {
        storeId,
      },
      include: {
        category: true,
        color: true,
      },
    });
  }

  async getById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        color: true,
        reviews: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getByCategory(categoryId: string) {
    const product = await this.prisma.product.findMany({
      where: {
        category: {
          id: categoryId,
        },
      },
      include: {
        category: true,
        color: true,
        reviews: true,
      },
    });

    if (!product) throw new NotFoundException('Products not found');

    return product;
  }

  async getMostPopular() {
    const mostPopularProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    const productIds = mostPopularProducts.map((item) => item.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        category: true,
      },
    });

    return products;
  }

  async getSimilar(id: string) {
    const currentProduct = await this.getById(id);

    if (!currentProduct) throw new NotFoundException('Product not found');

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          title: currentProduct.title,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });

    return products;
  }

  async create(storeId: string, dto: ProductDto) {
    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        images: dto.images,
        categoryId: dto.categoryId,
        colorId: dto.colorId,
        storeId,
      },
    });
  }

  async update(productId: string, dto: ProductDto) {
    await this.getById(productId);

    return this.prisma.product.update({
      where: {
        id: productId,
      },
      data: dto,
    });
  }

  async delete(productId: string) {
    await this.getById(productId);

    return this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }

  async getSearchTermFilter(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
}
