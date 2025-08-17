import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  items: { _id: Types.ObjectId; count: number }[];

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(600)
  payment: Types.ObjectId;
}
