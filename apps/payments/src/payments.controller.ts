import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CREATE_ORDER_PATTERN } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @MessagePattern(CREATE_ORDER_PATTERN)
  async createPayment(@Payload() orderID: string) {
    return this.paymentsService.createPayment(orderID);
  }
}
