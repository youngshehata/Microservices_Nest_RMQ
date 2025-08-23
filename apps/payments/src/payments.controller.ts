import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CREATE_PAYMENT_PATTERN, RpcResponse } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @MessagePattern(CREATE_PAYMENT_PATTERN)
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
}
