import {
  CREATE_ORDER_PATTERN,
  CreateOrderDto,
  FIND_ONE_ORDER_PATTERN,
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

  // ! ======================= CREATE ORDER =======================
  async creatOrder(order: CreateOrderDto) {
    return await firstValueFrom(
      this.ordersClient.send(CREATE_ORDER_PATTERN, order),
    );
  }
  // ! ======================= FIND ONE =======================
  async findOneOrder(filterQuery: any) {
    return await firstValueFrom(
      this.ordersClient.send(FIND_ONE_ORDER_PATTERN, filterQuery),
    );
  }
}
