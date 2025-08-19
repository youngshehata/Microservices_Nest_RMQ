import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({})
export class Item {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 500,
  })
  name: string;

  @Prop({ type: Number, required: true, min: 0, max: 9999999999 })
  cost: number;

  @Prop({ type: String, required: false })
  image?: string;

  @Prop({ type: Number, required: true, min: 0, max: 9999999999 })
  quantity: number;

  @Prop({ type: Date, default: Date.now })
  addedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  addedBy?: Types.ObjectId;

  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  updatedBy?: Types.ObjectId;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
