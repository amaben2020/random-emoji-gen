import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class SendService {
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionsService,
  ) {}

  public async send({
    amount,
    receiverEmail,
    senderEmail,
  }: {
    amount: number;
    receiverEmail: string;
    senderEmail: string;
  }) {
    await this.walletService.validateUserWallet(senderEmail, amount);

    // check if the other user has a wallet

    await this.walletService.viewUserWallet(receiverEmail);

    // deduct from the sender's wallet balance
    await this.walletService.withdrawFromWallet(senderEmail, amount);

    // update receiver's wallet balance (Update user wallet)
    const otherUserWallet = await this.walletService.updateWalletBalance(
      receiverEmail,
      amount,
    );
    // if yes then just use that wallet address
    // update the transaction table with the transaction details
    await this.transactionService.createTransaction({
      amount,
      title: `Sent ${amount} to ${receiverEmail} from ${senderEmail}`,
      walletId: otherUserWallet.id, // or whatever you want to do here...,
    });
    // return the transaction details

    return {
      success: true,
      data: {
        message: 'Transaction successful',
      },
    };
  }
}
