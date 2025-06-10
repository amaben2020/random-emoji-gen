import { Body, Controller, Post } from '@nestjs/common';
import { createTransactionDto } from './dtos/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}
  @Post()
  create(@Body() data: createTransactionDto) {
    return this.transactionsService.createTransaction(data);
  }
}
