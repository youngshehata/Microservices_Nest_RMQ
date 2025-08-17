import {
  CREATE_ORDER_PATTERN,
  CreateOrderDto,
  ORDERS_SERVICE,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GwOrdersService {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}
  async creatOrder(order: CreateOrderDto) {
    return await firstValueFrom(
      this.ordersClient.send(CREATE_ORDER_PATTERN, order),
    );
  }
}
