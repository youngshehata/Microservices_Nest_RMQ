import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  CREATE_INTENT_PATTERN,
  CREATE_PAYMENT_PATTERN,
  RmqService,
  RpcResponse,
} from '@app/common';

@Controller()
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly rmqService: RmqService,
  ) {}
  @MessagePattern(CREATE_PAYMENT_PATTERN)
  //! =================== CREATE NEW PAYMENT ===================
  async createPayment(@Payload() orderID: string, @Ctx() context: RmqContext) {
    try {
      const newPayment = await this.paymentsService.createPayment(orderID);
      this.rmqService.ack(context);
      return {
        data: newPayment,
      } as RpcResponse;
    } catch (error) {
      return {
        data: null,
        error: { message: error.message, statusCode: 400 },
      };
    }
  }
  //! =================== CREATE PAYMENT INTENT ===================
  @MessagePattern(CREATE_INTENT_PATTERN)
  async createPaymentIntent(
    @Payload() payload: { cost: number; paymentID: string },
    @Ctx() context: RmqContext,
  ) {
    try {
      const newPayment =
        await this.paymentsService.createPaymentIntent(payload);
      this.rmqService.ack(context);
      return {
        data: newPayment,
      } as RpcResponse;
    } catch (error) {
      return {
        data: null,
        error: { message: error.message, statusCode: 400 },
      };
    }
  }
}
