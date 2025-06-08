// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class WalletService {
//   public test() {
//     return 'test';
//   }
// }

//@ts-nocheck

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WalletService {
  private readonly paystackSecretKey: string;

  constructor(
    private configService: ConfigService,

    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,

    private readonly userService: UsersService,
  ) {
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
    console.log('data success from Paystack webhook:', data);

    const paymentDetails = {
      reference: data.reference,
      amount: data.amount / 100, // Convert from kobo to Naira
      customerEmail: data.customer.email,
      paidAt: new Date(data.paid_at),
      metadata: data.metadata,
    };

    // Find the user
    const user = await this.userService.findOneByEmail(
      paymentDetails.customerEmail,
    );
    console.log('User ====>', user);

    if (!user) {
      throw new Error('User not found');
    }

    // Find existing wallet
    let wallet = await this.walletRepository.findOne({
      where: { user: { id: user.id } },
    });

    console.log('paymentDetails.amount', paymentDetails.amount);

    if (wallet) {
      // Update existing wallet
      wallet.balance = +wallet.balance + +paymentDetails.amount;
      wallet.ref = paymentDetails.reference;
    } else {
      // Create new wallet if doesn't exist
      wallet = this.walletRepository.create({
        user: user,
        balance: paymentDetails.amount,
        currency: 'NGN',
        accountNumber: '0123456789', // Consider generating a unique account number
        ref: paymentDetails.reference,
      });
    }

    return await this.walletRepository.save(wallet);
  }

  async handleSuccessfulTransfer(data: any) {}

  async handleNewSubscription(data: any) {}

  async viewUserWallet(email: string) {
    const wallet = await this.walletRepository.findOne({
      relations: {
        user: true,
      },
      where: { user: { email } },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found for the given email.');
    }

    return wallet;
  }
}
