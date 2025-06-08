import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { PaystackPaymentData } from './paystack.interface';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,

    private readonly userService: UsersService,
  ) {}

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

  async handleSuccessfulPayment(data: PaystackPaymentData) {
    const paymentDetails = {
      reference: data.reference,
      amount: data.amount / 100, // Convert from kobo to Naira
      customerEmail: data.customer.email,
      paidAt: new Date(data.paid_at),
      metadata: data.metadata,
    };

    const user = await this.userService.findOneByEmail(
      paymentDetails.customerEmail,
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Find existing wallet
    let wallet = await this.walletRepository.findOne({
      where: { user: { id: user.id } },
    });

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
        accountNumber: '0123456789',
        ref: paymentDetails.reference,
      });
    }

    return await this.walletRepository.save(wallet);
  }

  handleSuccessfulTransfer(data: any) {
    console.log(data);
  }

  handleNewSubscription(data: any) {
    console.log(data);
  }

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
