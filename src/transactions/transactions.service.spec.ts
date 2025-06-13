/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// test if a transaction can be created with valid data
// get a transaction by id and check that the returned object matches the expected values
// get all transactions for a specific user and check that the returned array contains only transactions associated with that user
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Repository } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { TransactionsController } from './transactions.controller';

describe('TransactionsService', () => {
  let service: TransactionsService;

  let mockWalletRepository: jest.Mocked<Repository<Wallet>>;
  let mockTransactionRepository: jest.Mocked<Repository<Transaction>>;

  beforeEach(async () => {
    mockWalletRepository = {
      findOne: jest.fn(),
    } as any;

    mockTransactionRepository = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Wallet),
          useValue: mockWalletRepository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a transaction with valid data', async () => {
    const data = {
      title: 'test',
      walletId: 100,
      amount: 10000,
    };

    const mockWallet = { id: 1 } as Wallet;
    const mockTransaction = {
      id: 1,
      ...data,
      wallet: mockWallet,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Transaction;

    mockWalletRepository.findOne.mockResolvedValue(mockWallet);
    mockTransactionRepository.create.mockReturnValue(mockTransaction);
    mockTransactionRepository.save.mockResolvedValue(mockTransaction);

    const result = await service.createTransaction(data);

    expect(result.title).toBe('test');
    expect(result.amount).toBe(10000);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockTransactionRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'test',
        amount: 10000,
        wallet: mockWallet,
      }),
    );
  });
});
