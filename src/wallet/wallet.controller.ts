import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Public } from 'src/auth/decorator/auth.decorator';
import { PaystackWebhookBody } from './paystack.interface';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Body() body: PaystackWebhookBody,
    @Headers('x-paystack-signature') signature: string,
  ) {
    // 1. Verify the webhook signature
    const isValid = this.walletService.verifyWebhook(body, signature);

    if (!isValid) {
      throw new HttpException('Invalid signature', HttpStatus.FORBIDDEN);
    }

    // 2. Process based on event type
    try {
      const event = body.event;
      const data = body.data;

      switch (event) {
        case 'charge.success':
          await this.walletService.handleSuccessfulPayment(data);
          break;

        case 'transfer.success':
          await this.walletService.handleSuccessfulTransfer(data);
          break;

        case 'subscription.create':
          await this.walletService.handleNewSubscription(data);
          break;

        default:
        // this.logger.log(`Unhandled event type: ${event}`);
      }

      return { status: 'success', message: 'Webhook processed' };
    } catch (error) {
      // this.logger.error('Webhook processing error', error.stack);
      // throw new HttpException();
      console.log(error);
    }
  }

  @Public()
  @Get('view-wallet')
  async viewUserWallet(@Query('email') email: string) {
    return await this.walletService.viewUserWallet(email);
  }
}
