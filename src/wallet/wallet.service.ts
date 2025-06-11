import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { PaystackPaymentData } from './paystack.interface';
import { ConfigType } from '@nestjs/config';
import { paystackConfig } from './config/paystackConfig';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,

    private readonly userService: UsersService,

    @Inject(paystackConfig.KEY)
    private readonly paystackConfiguration: ConfigType<typeof paystackConfig>,
  ) {}

  verifyWebhook(body: any, signature: string): boolean {
    if (!signature) {
      return false;
    }

    const hash = crypto
      .createHmac('sha512', this.paystackConfiguration.secretKey as string)
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

  async validateUserWallet(
    email: string,
    amount: number | string,
  ): Promise<boolean> {
    const wallet = await this.walletRepository.findOne({
      relations: {
        user: true,
      },
      where: { user: { email } },
    });

    if (!wallet?.id) {
      throw new NotFoundException('Wallet not found for the given email.');
    }

    return Number(wallet.balance) >= Number(amount);
  }

  async withdrawFromWallet(userEmail: string, amount: number) {
    const wallet = await this.walletRepository.findOne({
      relations: {
        user: true,
      },
      where: { user: { email: userEmail } },
    });

    if (!wallet)
      throw new NotFoundException('Wallet not found for the given email.');

    if (amount > wallet.balance)
      throw new BadRequestException('Insufficient funds in your wallet.');

    wallet.balance = +wallet?.balance - amount;

    return await this.walletRepository.save(wallet);
  }

  async updateWalletBalance(email: string, amount: number): Promise<Wallet> {
    // 1. Find the wallet with a lock to prevent race conditions
    const wallet = await this.walletRepository.findOne({
      where: { user: { email } },

      relations: ['user'], // Eager load user if needed
      // lock: { mode: 'pessimistic_write' }, // Critical for concurrent updates
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // 2. Validate business logic (e.g., prevent negative balance)
    if (wallet.balance + amount < 0) {
      throw new Error('Insufficient funds');
    }

    // 3. Update balance atomically
    wallet.balance = Number(wallet.balance) + Number(amount);

    // 4. Save and return updated wallet
    return await this.walletRepository.save(wallet);
  }
}

// Transaction Example:
// await dataSource.transaction(async (manager) => {
//   const wallet = await manager.findOne(Wallet, { where: { id: 1 } });
//   wallet.balance += 100;

//   const user = await manager.findOne(User, { where: { id: 2 } });
//   user.lastPayment = new Date();

//   await manager.save([wallet, user]); // Flushes ALL changes in one transaction
// });
