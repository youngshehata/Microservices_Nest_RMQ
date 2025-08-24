import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CREATE_INTENT_PATTERN,
  CREATE_PAYMENT_PATTERN,
  RpcResponse,
} from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @MessagePattern(CREATE_PAYMENT_PATTERN)
  //! =================== CREATE NEW PAYMENT ===================
  async createPayment(@Payload() orderID: string) {
    try {
      const newPayment = await this.paymentsService.createPayment(orderID);
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
  ) {
    try {
      const newPayment =
        await this.paymentsService.createPaymentIntent(payload);
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
