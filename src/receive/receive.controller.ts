import { Body, Controller, Post } from '@nestjs/common';
import { ReceiveMoneyDto } from './receive-money.dto';
import { ReceiveService } from './receive.service';
import { Public } from '../auth/decorator/auth.decorator';

@Controller('receive')
export class ReceiveController {
  constructor(private readonly receiveService: ReceiveService) {}

  @Public()
  @Post()
  receive(@Body() data: ReceiveMoneyDto) {
    return this.receiveService.receiveMoney(data);
  }
}
