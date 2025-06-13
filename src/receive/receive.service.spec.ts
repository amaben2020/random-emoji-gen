import { Test, TestingModule } from '@nestjs/testing';
import { ReceiveService } from './receive.service';
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletService } from '../wallet/wallet.service';

describe('ReceiveService', () => {
  let service: ReceiveService;
  let mockUnitOfWorkService: Partial<UnitOfWorkService>;
  let mockTransactionsService: Partial<TransactionsService>;
  let mockWalletService: Partial<WalletService>;

  beforeEach(async () => {
    // Single correct mock definition
    mockUnitOfWorkService = {
      startTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      getManager: jest.fn().mockReturnValue({}),
    };

    mockTransactionsService = {
      createTransaction: jest.fn().mockResolvedValue(undefined),
    };

    mockWalletService = {
      validateUserWallet: jest.fn().mockResolvedValue(undefined),
      updateWalletBalance: jest.fn().mockResolvedValue({ id: 'wallet-id' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiveService,
        {
          provide: UnitOfWorkService,
          useValue: mockUnitOfWorkService,
        },
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: WalletService,
          useValue: mockWalletService,
        },
      ],
    }).compile();

    service = module.get<ReceiveService>(ReceiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call startTransaction when receiving money', async () => {
    const dto = {
      senderEmail: 'sender@gmail.com',
      recipientEmail: 'recipient@gmail.com',
      amount: 1000,
    };

    await service.receiveMoney(dto);

    expect(mockUnitOfWorkService.startTransaction).toHaveBeenCalled();
    expect(mockWalletService.validateUserWallet).toHaveBeenCalledWith(
      dto.senderEmail,
      dto.amount,
      expect.anything(),
    );
    expect(mockWalletService.updateWalletBalance).toHaveBeenCalledTimes(2);
    expect(mockTransactionsService.createTransaction).toHaveBeenCalled();
    expect(mockUnitOfWorkService.commitTransaction).toHaveBeenCalled();
    expect(mockUnitOfWorkService.release).toHaveBeenCalled();
  });

  it('should deduct money from sender and add to recipient', async () => {
    const dto = {
      amount: 1000,
      senderEmail: 'sender@gmail.com',
      recipientEmail: 'receiver@gmail.com',
    };

    mockWalletService.validateUserWallet = jest
      .fn()
      .mockResolvedValue(undefined);
    mockWalletService.updateWalletBalance = jest
      .fn()
      .mockResolvedValueOnce({ id: 1 }) // receiver
      .mockResolvedValueOnce({ id: 2 }); // sender

    await service.receiveMoney(dto);

    expect(mockWalletService.validateUserWallet).toHaveBeenCalledWith(
      'sender@gmail.com',
      1000,
      expect.anything(), // the manager
    );

    expect(mockWalletService.updateWalletBalance).toHaveBeenCalledWith(
      'receiver@gmail.com',
      1000,
      expect.anything(),
    );

    expect(mockWalletService.updateWalletBalance).toHaveBeenCalledWith(
      'sender@gmail.com',
      -1000,
      expect.anything(),
    );
  });

  it('should validate sender has enough money', async () => {
    const dto = {
      amount: 500,
      senderEmail: 'alice@email.com',
      recipientEmail: 'bob@email.com',
    };

    await service.receiveMoney(dto);

    expect(mockWalletService.validateUserWallet).toHaveBeenCalledWith(
      'alice@email.com',
      500,
      expect.anything(), // manager
    );
  });

  it('should create a transaction record', async () => {
    const dto = {
      amount: 1000,
      senderEmail: 'alice@email.com',
      recipientEmail: 'bob@email.com',
    };

    await service.receiveMoney(dto);

    expect(mockTransactionsService.createTransaction).toHaveBeenCalledWith(
      {
        amount: 1000,
        walletId: 'wallet-id',
        title: 'alice@email.com successfully transferred to bob@email.com',
      },
      // expect.anything(), // the transaction manager
    );
  });
  it('should rollback if something goes wrong', async () => {
    const dto = {
      amount: 100,
      senderEmail: 'fail@user.com',
      recipientEmail: 'receiver@user.com',
    };

    // Cause an error on purpose
    mockWalletService.updateWalletBalance = jest
      .fn()
      .mockRejectedValueOnce(new Error('Something went wrong'));

    await expect(service.receiveMoney(dto)).rejects.toThrow(
      'Something went wrong',
    );

    expect(mockUnitOfWorkService.rollbackTransaction).toHaveBeenCalled();
  });
});
