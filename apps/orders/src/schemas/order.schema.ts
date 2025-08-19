import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({})
export class Order {
  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'payments', required: false })
  payment?: Types.ObjectId;

  @Prop({
    type: [
      {
        _id: { type: Types.ObjectId, ref: 'products', required: true },
        count: { type: Number, required: true },
      },
    ],
    default: [],
  })
  items: { _id: Types.ObjectId; count: number }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
