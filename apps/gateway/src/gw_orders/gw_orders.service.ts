import {
  ATTACH_PAYMENT_PATTERN,
  CREATE_ORDER_PATTERN,
  CREATE_PAYMENT_PATTERN,
  CreateOrderDto,
  FIND_ONE_ORDER_PATTERN,
  ORDERS_SERVICE,
  PAYMENTS_SERVICE,
  RpcResponse,
} from '@app/common';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GwOrdersService {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsClient: ClientProxy,
  ) {}

  // ! ======================= CREATE ORDER =======================
  async creatOrder(order: CreateOrderDto) {
    if (order.items.length === 0)
      throw new BadRequestException('Order must have items');

    // Creating the order
    const newOrder: RpcResponse = await firstValueFrom(
      this.ordersClient.send(CREATE_ORDER_PATTERN, order),
    );
    if (newOrder.error) throw new BadRequestException(newOrder.error.message);

    // Creating the payment
    const payment: RpcResponse = await firstValueFrom(
      this.paymentsClient.send(CREATE_PAYMENT_PATTERN, newOrder.data._id),
    );
    if (payment.error) throw new BadRequestException(payment.error.message);

    // Attaching the payment
    const attached: RpcResponse = await firstValueFrom(
      this.ordersClient.send(ATTACH_PAYMENT_PATTERN, {
        paymentID: payment.data._id,
        orderID: newOrder.data._id,
      }),
    );
    if (attached.error) throw new BadRequestException(attached.error.message);
    return attached.data;
  }
  // ! ======================= FIND ONE =======================
  async findOneOrder(filterQuery: any) {
    return await firstValueFrom(
      this.ordersClient.send(FIND_ONE_ORDER_PATTERN, filterQuery),
    );
  }
}
