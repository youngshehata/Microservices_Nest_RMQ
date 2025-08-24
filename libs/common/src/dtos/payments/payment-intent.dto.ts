import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class PaymentIntentDto {
  @IsString()
  @IsNotEmpty()
  paymentID: string;

  @IsNotEmpty()
  @IsPositive()
  cost: number;
}
