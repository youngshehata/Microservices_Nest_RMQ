import {
  ATTACH_PAYMENT_PATTERN,
  CREATE_ORDER_PATTERN,
  CREATE_PAYMENT_PATTERN,
  CreateOrderDto,
  FIND_ONE_ORDER_PATTERN,
  ORDERS_SERVICE,
  PAYMENTS_SERVICE,
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

    const newOrder = await firstValueFrom(
      this.ordersClient.send(CREATE_ORDER_PATTERN, order),
    );
    const payment = await firstValueFrom(
      this.paymentsClient.send(CREATE_PAYMENT_PATTERN, newOrder._id),
    );

    const attached = await firstValueFrom(
      this.ordersClient.send(ATTACH_PAYMENT_PATTERN, {
        paymentID: payment._id,
        orderID: newOrder._id,
      }),
    );
    return attached;
  }
  // ! ======================= FIND ONE =======================
  async findOneOrder(filterQuery: any) {
    return await firstValueFrom(
      this.ordersClient.send(FIND_ONE_ORDER_PATTERN, filterQuery),
    );
  }
}
