import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class ReceiveMoneyDto {
  @IsEmail()
  @IsNotEmpty()
  senderEmail: string;

  @IsEmail()
  @IsNotEmpty()
  recipientEmail: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
