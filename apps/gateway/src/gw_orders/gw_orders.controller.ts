import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GwOrdersService } from './gw_orders.service';
import { CreateOrderDto, PaymentIntentDto, RpcResponse } from '@app/common';

@Controller('orders')
export class GwOrdersController {
  constructor(private readonly gwOrdersService: GwOrdersService) {}

  // ! ======================= CREATE ORDER =======================
  @Post()
  async createOrder(@Body() order: CreateOrderDto) {
    return await this.gwOrdersService.creatOrder(order);
  }

  // ! ======================= PAY FOR ORDER =======================
  @Post('pay')
  async payOrder(@Body() data: PaymentIntentDto) {
    const respone: RpcResponse = await this.gwOrdersService.paymentIntent(data);
    if (respone.error)
      throw new HttpException(respone.error.message, respone.error.statusCode);
    return respone.data;
  }

  // ! ======================= FIND ONE ORDER =======================
  @Post('findOne')
  async findOne(@Body() filterQuery: any) {
    return await this.gwOrdersService.findOneOrder(filterQuery);
  }

  // ! ======================= FIND ONE ORDER =======================
  @Post('test')
  async test() {
    return 'Hello World';
  }
}
