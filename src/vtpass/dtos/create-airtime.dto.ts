import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PurchaseAirtelDataDto {
  // @IsString()
  // @IsNotEmpty()
  // request_id: string;

  @IsString()
  @IsNotEmpty()
  serviceID: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  variation_code: string;
}
