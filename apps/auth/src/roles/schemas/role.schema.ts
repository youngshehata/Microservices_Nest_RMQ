import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({})
export class Role {
  _id: Types.ObjectId;
  @Prop({
    required: true,
    unique: true,
    type: String,
    maxLength: 200,
    minlength: 2,
  })
  name: string;

  @Prop({
    type: [String],
    required: true,
    default: [], // optional: ensures it's never undefined
  })
  permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
