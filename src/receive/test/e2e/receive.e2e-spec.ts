import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource, Repository } from 'typeorm';

import { Wallet } from 'src/wallet/wallet.entity';
import { AuthGuard } from 'src/auth/auth.guard.guard';
import { User } from 'src/users/user.entity';

describe('POST /receive (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepo: Repository<User>;
  let walletRepo: Repository<Wallet>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthGuard) // ✅ override actual guard
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    dataSource = moduleRef.get(DataSource);
    userRepo = dataSource.getRepository(User);
    walletRepo = dataSource.getRepository(Wallet);

    await seedTestData();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  const senderEmail = 'bojack@horseman2.com';
  const recipientEmail = 'amaben@gmail3.com';

  const seedTestData = async () => {
    // Delete users first
    await userRepo.delete({ email: senderEmail });
    await userRepo.delete({ email: recipientEmail });

    await walletRepo.delete({ accountNumber: '1000001' });
    await walletRepo.delete({ accountNumber: '1000002' });

    const senderWallet = walletRepo.create({
      balance: 9000,
      accountNumber: '1000001',
      currency: 'NGN',
      ref: 'ref-sender',
    });

    const sender = userRepo.create({
      firstName: 'Bojack',
      lastName: 'Horseman',
      email: senderEmail,
      password: 'securepass',
      wallet: senderWallet,
    });
    await userRepo.save(sender);

    const recipientWallet = walletRepo.create({
      balance: 500,
      accountNumber: '1000002',
      currency: 'NGN',
      ref: 'ref-recipient',
    });

    const recipient = userRepo.create({
      firstName: 'Amaben',
      lastName: 'Gmail',
      email: recipientEmail,
      password: 'securepass',
      wallet: recipientWallet,
    });
    await userRepo.save(recipient);
    console.log('RECIPIENT', recipient);
    console.log('sender', sender);
  };

  it('transfers funds successfully between users', async () => {
    const res = await request(app.getHttpServer()).post('/receive').send({
      amount: 1,
      senderEmail: 'bojack@horseman2.com',
      recipientEmail: 'amaben@gmail3.com',
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      data: { success: true },
    });
  });

  it('fails if balance is insufficient', async () => {
    const res = await request(app.getHttpServer()).post('/receive').send({
      amount: 9001,
      senderEmail: senderEmail,
      recipientEmail: recipientEmail,
    });

    console.log(res.body);

    expect(res.status).toBe(400);

    expect(res?.body?.message as any).toContain('Insufficient');
  });
});
