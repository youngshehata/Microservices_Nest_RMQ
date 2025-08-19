import { AbstractDocument } from '@app/common/database/abstract.repo';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class PaymentsRepo extends AbstractDocument<Payment> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(Payment.name) private readonly Payment: Model<Payment>,
  ) {
    super(connection, Payment);
  }
}
