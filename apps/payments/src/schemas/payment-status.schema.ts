import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'payments_statuses' })
export class PaymentStatus {
  @Prop({ type: String, required: true, minlength: 2, maxlength: 200 })
  name: Date;
}

export const PaymentStatusSchema = SchemaFactory.createForClass(PaymentStatus);
