import { Injectable } from '@nestjs/common';
import { TransactionsService } from 'src/transactions/transactions.service';
import { UnitOfWorkService } from 'src/unit-of-work/unit-of-work.service';
import { WalletService } from 'src/wallet/wallet.service';
import { ReceiveMoneyDto } from './receive-money.dto';

@Injectable()
export class ReceiveService {
  constructor(
    private readonly unitOfWorkService: UnitOfWorkService,
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionsService,
  ) {}
  public async receiveMoney({
    senderEmail,
    recipientEmail,
    amount,
  }: ReceiveMoneyDto) {
    console.log('STARTED!!!');

    try {
      // await this.unitOfWorkService.startTransaction();
      // step 1: check balance of sender and receiver

      await this.walletService.validateUserWallet(senderEmail, amount);
      // step 2: update balance of sender and receiver
      const [receiverBalance, senderBalance] = await Promise.all([
        this.walletService.updateWalletBalance(
          recipientEmail,
          amount,
          // this.unitOfWorkService.getManager(),
        ),
        this.walletService.updateWalletBalance(
          senderEmail,
          -amount,
          // this.unitOfWorkService.getManager(),
        ),
      ]);
      console.log('receiver bal', receiverBalance);
      console.log(senderBalance);
      const transactionData = {
        senderId: senderEmail,
        receiverId: recipientEmail,
        amount,
        senderBalanceBeforeTransfer: senderBalance.balance,
        receiverBalanceAfterTransfer: receiverBalance.balance,
      };
      await this.transactionService.createTransaction({
        amount: transactionData.amount,
        title: `${transactionData.senderId} successfully transferred to ${transactionData.receiverId}`,
        walletId: receiverBalance.id,
      });
      // Commit if all succeeds
      // await this.unitOfWorkService.commitTransaction();
      return { success: true };
    } catch (error) {
      // Rollback on any error
      // await this.unitOfWorkService.rollbackTransaction();
      console.log(error);
      throw error; // Re-throw for global exception filters
    } finally {
      // await this.unitOfWorkService.release();
    }
  }
}

// you receive money by sharing your email address with sender
