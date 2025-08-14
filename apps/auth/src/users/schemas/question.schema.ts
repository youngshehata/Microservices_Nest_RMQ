import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({})
export class Question {
  @Prop({ required: true, type: String, maxLength: 100, minlength: 5 })
  question: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
