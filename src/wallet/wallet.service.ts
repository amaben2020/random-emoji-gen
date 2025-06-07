// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class WalletService {
//   public test() {
//     return 'test';
//   }
// }

//@ts-nocheck

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class WalletService {
  private readonly paystackSecretKey: string;

  constructor(private configService: ConfigService) {
    // this.paystackSecretKey = this.configService.get<string>(
    //   'PAYSTACK_SECRET_KEY',
    // );
  }

  verifyWebhook(body: any, signature: string): boolean {
    if (!signature) {
      return false;
    }

    const hash = crypto
      .createHmac('sha512', 'sk_test_0c1f79ca05de05c05b0cdbf0b48d148999239357')
      .update(JSON.stringify(body))
      .digest('hex');

    return hash === signature;
  }

  async handleSuccessfulPayment(data: any) {
    // Implement your business logic here:
    // - Update database
    // - Send confirmation email
    // - Grant user access, etc.

    console.log('data success', data);

    const paymentDetails = {
      reference: data.reference,
      amount: data.amount / 100, // Convert from kobo to Naira
      customerEmail: data.customer.email,
      paidAt: new Date(data.paid_at),
      metadata: data.metadata,
    };

    // this.logger.log('Payment details:', paymentDetails);

    // Example: Update your database
    // await this.paymentRepository.savePayment(paymentDetails);
  }

  async handleSuccessfulTransfer(data: any) {}

  async handleNewSubscription(data: any) {}
}
