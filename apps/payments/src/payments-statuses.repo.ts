import { AbstractDocument } from '@app/common/database/abstract.repo';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { PaymentStatus } from './schemas/payment-status.schema';

@Injectable()
export class PaymentsStatusesRepo extends AbstractDocument<PaymentStatus> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(PaymentStatus.name)
    private readonly paymentStatue: Model<PaymentStatus>,
  ) {
    super(connection, paymentStatue);
  }

  async getPendingStatusId(): Promise<Types.ObjectId> {
    const result = await this.paymentStatue.findOne({ name: 'pending' }).exec();
    if (!result) throw new Error('Pending status not found');
    return result._id;
  }
}
