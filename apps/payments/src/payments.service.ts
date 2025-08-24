import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';
import { Model, Types } from 'mongoose';
import { PaymentStatus } from './schemas/payment-status.schema';
import { defaultPaymentStatuses } from './schemas/paymentStatuses';
import { PaymentsRepo } from './payments.repo';
import { PaymentsStatusesRepo } from './payments-statuses.repo';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(PaymentStatus.name)
    private readonly paymentStatus: Model<PaymentStatus>,
    private readonly paymentsRepo: PaymentsRepo,
    private readonly paymentsStatusRepo: PaymentsStatusesRepo,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!!, {
      apiVersion: '2025-07-30.basil',
    });
  }

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

  //! Create New Payment
  async createPayment(orderID: string): Promise<Payment> {
    const objectId = new Types.ObjectId(orderID);
    const paymentStatus = await this.paymentsStatusRepo.getPendingStatusId();
    return this.paymentsRepo.create({ order: objectId, status: paymentStatus });
  }

  //! Pay For Order
  async createPaymentIntent(data: { cost: number; paymentID: string }) {
    const payment = await this.paymentModel.findById(data.paymentID).exec();
    if (!payment) throw new Error('Payment not found');
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: data.cost * 100, // in cents
      currency: 'usd',
      payment_method: 'pm_card_visa',
    });

    await this.paymentsRepo.updateOne(
      { cost: data.cost, stripeID: paymentIntent.id },
      { _id: payment._id },
    );

    return {
      paymentID: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };
  }
}
