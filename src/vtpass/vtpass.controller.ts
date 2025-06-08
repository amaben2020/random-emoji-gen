import { Body, Controller, Post, Query } from '@nestjs/common';
import { PurchaseAirtelDataDto } from './dtos/create-airtime.dto';
import { VtpassService } from './vtpass.service';
import { Public } from 'src/auth/decorator/auth.decorator';

@Controller('vtpass')
export class VtpassController {
  constructor(private readonly vtpassService: VtpassService) {}

  @Public()
  @Post('purchase/airtel-data')
  async purchaseAirtelData(
    @Body() purchaseDataDto: PurchaseAirtelDataDto,
    @Query('email') email: string,
  ): Promise<any> {
    return await this.vtpassService.purchaseAirtelData(purchaseDataDto, email);
  }
}
