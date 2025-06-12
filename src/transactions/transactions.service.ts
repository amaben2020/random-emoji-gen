import { BadRequestException, Injectable } from '@nestjs/common';
import { createTransactionDto } from './dtos/create-transaction.dto';
import { Transaction } from './transactions.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}
  public async createTransaction(data: createTransactionDto): Promise<any> {
    try {
      // you must always fetch the entity first before saving it to avoid race conditions.
      const wallet = await this.walletRepository.findOne({
        where: { id: data.walletId },
      });

      if (!wallet) {
        throw new Error();
      }
      const transaction = this.transactionRepository.create({
        ...data,
        wallet,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
      return await this.transactionRepository.save(transaction);
    } catch (error) {
      console.log('ERROR ===>', error);
      throw new BadRequestException('Could not create transaction');
    }
  }

  public async getTransactionsByWalletId(
    walletId: number,
  ): Promise<Transaction[]> {
    try {
      return await this.transactionRepository.find({
        where: {
          wallet: {
            id: walletId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Could not find transactions');
    }
  }
}
