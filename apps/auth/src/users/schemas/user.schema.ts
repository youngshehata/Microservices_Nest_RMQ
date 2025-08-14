import { MongoDBModule } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({})
export class User {
  @Prop({
    required: true,
    unique: true,
    type: String,
    maxLength: 200,
    minlength: 2,
  })
  username: string;

  @Prop({ required: true, type: String, maxLength: 600, minlength: 6 })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true, type: String, maxLength: 600, minlength: 6 })
  secret_answer: string;

  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  secret_question: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
