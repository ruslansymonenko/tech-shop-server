import { EnumOrderStatus } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export interface IPaymentObject {
  transactionType: string;
  merchantAccount: string;
  merchantDomainName: string;
  merchantTransactionSecureType: string;
  language: string;
  returnUrl: string;
  serviceUrl: string;
  orderReference: string;
  orderDate: number;
  orderNo: string;
  amount: number;
  currency: string;
  productName: string[];
  productPrice: number[];
  productCount: number[];
  clientAccountId: string;
  paymentSystems: string;
}

export class PaymentStatusDto {
  @IsEnum(EnumOrderStatus, {
    message: 'Order status is required',
  })
  status: EnumOrderStatus;

  @IsString()
  orderId: string;
}
