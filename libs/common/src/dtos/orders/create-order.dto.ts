import { IsArray, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  items: { _id: Types.ObjectId; count: number }[];
}
