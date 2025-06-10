import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createTransactionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  wallet: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
