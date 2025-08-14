import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(600)
  password: string;
}
