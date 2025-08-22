import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';
import { Model, Types } from 'mongoose';
import { PaymentStatus } from './schemas/payment-status.schema';
import { defaultPaymentStatuses } from './schemas/paymentStatuses';
import { PaymentsRepo } from './payments.repo';
import { PaymentsStatusesRepo } from './payments-statuses.repo';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(PaymentStatus.name)
    private readonly paymentStatus: Model<PaymentStatus>,
    private readonly paymentsRepo: PaymentsRepo,
    private readonly paymentsStatusRepo: PaymentsStatusesRepo,
  ) {}

  //! Seed Payments Status
  async seedPaymentStatus() {
    let seededCount = 0;
    for (const status of defaultPaymentStatuses) {
      const existingStatus = await this.paymentStatus
        .findOne({ name: status.name })
        .exec();
      if (!existingStatus) {
        await this.paymentStatus.create({ name: status.name });
        seededCount++;
      }
    }
    if (seededCount === defaultPaymentStatuses.length) {
      console.log('Payment Statuses seeded successfully');
    }
  }

  //! Get Pending Payment Status Id
  async createPayment(orderID: string): Promise<Payment> {
    console.log(orderID);

    const objectId = new Types.ObjectId(orderID);
    const paymentStatus = await this.paymentsStatusRepo.getPendingStatusId();
    return this.paymentsRepo.create({ order: objectId, status: paymentStatus });
  }
}
