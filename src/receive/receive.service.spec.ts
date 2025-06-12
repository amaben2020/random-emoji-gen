import { Test, TestingModule } from '@nestjs/testing';
import { ReceiveService } from './receive.service';

import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletService } from '../wallet/wallet.service';

// describe('ReceiveService', () => {
//   let service: ReceiveService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ReceiveService,
//         {
//           provide: TransactionsService,
//           useValue: {},
//         },
//         {
//           provide: UnitOfWorkService,
//           useValue: {},
//         },
//         {
//           provide: WalletService,
//           useValue: {},
//         },
//       ],
//     }).compile();

//     service = module.get<ReceiveService>(ReceiveService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

describe('ReceiveService', () => {
  let service: ReceiveService;
  let mockTransactionsService: Partial<TransactionsService>;
  let mockUnitOfWorkService: Partial<UnitOfWorkService>;
  let mockWalletService: Partial<WalletService>;

  beforeEach(async () => {
    mockTransactionsService = {
      // Add mock methods your service uses
    };
    mockUnitOfWorkService = {
      // Add mock methods your service uses
    };
    mockWalletService = {
      // Add mock methods your service uses
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiveService,
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: UnitOfWorkService,
          useValue: mockUnitOfWorkService,
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
});
