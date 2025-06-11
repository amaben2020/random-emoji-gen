import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createTransactionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  walletId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
