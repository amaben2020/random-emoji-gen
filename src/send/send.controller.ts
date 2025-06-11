import { Body, Controller, Post, Request } from '@nestjs/common';
import { SendService } from './send.service';

@Controller('send')
export class SendController {
  constructor(private readonly sendService: SendService) {}
  @Post()
  public send(
    @Body()
    body: {
      amount: number;
      receiverEmail: string;
    },
    @Request() req: { user: { email: string } },
  ) {
    return this.sendService.send({
      senderEmail: req.user.email,
      amount: body.amount,
      receiverEmail: body.receiverEmail,
    });
  }
}
