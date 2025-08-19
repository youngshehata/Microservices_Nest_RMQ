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
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
