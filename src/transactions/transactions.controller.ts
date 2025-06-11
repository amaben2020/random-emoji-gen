import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createTransactionDto } from './dtos/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}
  @Post()
  create(@Body() data: createTransactionDto) {
    return this.transactionsService.createTransaction(data);
  }

  @Get(':walletId')
  getTransactionsByWalletId(@Param('walletId') walletId: number) {
    return this.transactionsService.getTransactionsByWalletId(walletId);
  }
}
