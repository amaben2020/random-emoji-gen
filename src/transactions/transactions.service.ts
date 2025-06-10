import { BadRequestException, Injectable } from '@nestjs/common';
import { createTransactionDto } from './dtos/create-transaction.dto';
import { Transaction } from './transactions.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'src/wallet/wallet.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}
  public async createTransaction(data: createTransactionDto): Promise<any> {
    console.log('data', data);
    try {
      const wallet = await this.walletRepository.findOne({
        // where: { id: data.wallet },
        where: { id: data.wallet },
      });
      console.log('WALLET ==', wallet);
      if (!wallet) {
        throw new Error();
      }
      const transaction = this.transactionRepository.create({
        ...data,
        wallet,
      });
      return await this.transactionRepository.save(transaction);
    } catch (error) {
      console.log('ERROR ===>', error);
      throw new BadRequestException('Could not create transaction');
    }
  }
}
