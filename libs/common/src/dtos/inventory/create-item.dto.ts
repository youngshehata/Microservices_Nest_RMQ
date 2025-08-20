import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsPositive,
  Max,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  name: string;

  @IsNotEmpty()
  @IsPositive()
  @Max(9999999999)
  cost: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsPositive()
  @Max(9999999999)
  quantity: number;

  @IsOptional()
  addedBy?: Types.ObjectId;
}
