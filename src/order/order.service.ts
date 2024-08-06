import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import * as crypto from 'crypto';
import { IPaymentObject, PaymentStatusDto } from './dto/payment-status.dto';
import { OrderDto } from './dto/order.dto';
import { ProductService } from '../product/product.service';
import { EnumOrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  private merchantAccount: string;
  private merchantDomainName: string;
  private merchantSecretKey: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private productService: ProductService,
  ) {
    this.merchantAccount = this.configService.get<string>('MERCHANT_ACCOUNT');
    this.merchantDomainName = this.configService.get<string>('MERCHANT_DOMAIN_NAME');
    this.merchantSecretKey = this.configService.get<string>('MERCHANT_SECRET_KEY');
  }

  async sendPayment(
    amount: number,
    orderReference: string,
    orderId: string,
    productNames: string[],
    productPrices: number[],
    productCounts: number[],
    clientId: string,
  ) {
    const orderDate = Math.floor(Date.now() / 1000);
    const afterPaymentReturnURL = this.configService.get('CLIENT_URL');
    const afterPaymentServerResponseURL = this.configService.get('SERVER_URL');

    const data: IPaymentObject = {
      transactionType: 'SALE',
      merchantAccount: this.merchantAccount,
      merchantDomainName: this.merchantDomainName,
      merchantTransactionSecureType: 'AUTO',
      language: 'UA',
      returnUrl: afterPaymentReturnURL,
      serviceUrl: afterPaymentServerResponseURL,
      orderReference: orderReference,
      orderDate: orderDate,
      orderNo: orderId,
      amount: amount,
      currency: 'UAH',
      productName: productNames,
      productPrice: productPrices,
      productCount: productCounts,
      clientAccountId: clientId,
      paymentSystems: 'googlePay',
    };

    // const signature = this.generateSignature(data);
    // data['merchantSignature'] = signature;

    return {
      data: data,
    };

    // try {
    //   const response = await axios.post('https://secure.wayforpay.com/pay', data);
    //   return response.data;
    // } catch (error) {
    //   throw new Error('Payment creation failed');
    // }
  }

  async createPayment(dto: OrderDto, userId: string) {
    console.log(dto);
    const orderItems = dto.items.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      product: {
        connect: {
          id: item.productId,
        },
      },
      store: {
        connect: {
          id: item.storeId,
        },
      },
    }));

    const total = dto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: orderItems,
        },
        total,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const productIds = dto.items.map((item) => item.productId);
    const productNames = await this.getProductNames(productIds);
    const productPrices = dto.items.map((item) => item.price);
    const productCounts = dto.items.map((item) => item.quantity);

    const testInvoiceRef = `invoice №${order.id}`; //For testing

    const payment = await this.sendPayment(
      total,
      testInvoiceRef,
      order.id,
      productNames,
      productPrices,
      productCounts,
      userId,
    );

    return payment;
  }

  async updateStatus(dto: PaymentStatusDto) {
    if (dto.status === 'PAID') {
      await this.prisma.order.update({
        where: {
          id: dto.orderId,
        },
        data: {
          status: EnumOrderStatus.PAID,
        },
      });

      return true;
    }

    await this.prisma.order.update({
      where: {
        id: dto.orderId,
      },
      data: {
        status: EnumOrderStatus.PENDING,
      },
    });

    return true;
  }

  async getProductNames(productsId: string[]) {
    const productNames = productsId.map(async (productId) => {
      const product = await this.productService.getById(productId);
      return product.title;
    });

    return productsId;
  }

  // generateSignature(data: any): string {
  //   const signatureString = `${this.merchantAccount};${this.merchantDomainName};${data.orderReference};${data.orderDate};${data.amount};UAH;Product Name;${data.amount};1`;
  //   const signatureString =
  //     'test_merch_n1;www.market.ua;DH1722956520;1415379863;1547.36;UAH;Процессор Intel Core i5-4670 3.4GHz;Память Kingston DDR3-1600 4096MB PC3-12800;1;1;1000;547.36\n';
  //   return crypto.createHmac('md5', this.merchantSecretKey).update(signatureString).digest('hex');
  // }
}
