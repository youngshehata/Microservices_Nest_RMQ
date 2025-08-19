import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreatePaymentrDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(600)
  order: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(600)
  status: Types.ObjectId;
}
