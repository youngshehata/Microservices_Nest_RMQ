import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({})
export class Payment {
  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PaymentStatus', required: true })
  status: Types.ObjectId;

  @Prop({ type: Number, required: false })
  cost?: number;

  @Prop({ type: String, required: false })
  stripeID?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
