// import * as request from 'supertest';
// import { INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { AppModule } from '../../../app.module';
// import { AuthGuard } from '../../../common/auth/auth.guard';

// // this is basically testing the controller logic over http
// // run your tests in a test environment i.e create a separate database for testing purposes inside app modules, drop all tables after test is done

// describe('POST /receive (e2e)', () => {
//   let app: INestApplication; // the interface of the Nest app

//   // In your test setup
//   jest.spyOn(AuthGuard.prototype, 'canActivate').mockImplementation(() => true);

//   // before every single test case, we need to initialize our nest app
//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleRef.createNestApplication();
//     app.setGlobalPrefix('');
//     await app.init();
//   });

//   afterAll(async () => {
//     await app.close();
//   });

//   it('transfers funds successfully between users', async () => {
//     const res = await request(app.getHttpServer())
//       .post('/receive')
//       .set(
//         'Authorization',
//         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoiYW1hYmVuQGdtYWlsMi5jb20iLCJ1c2VyTmFtZSI6IkJlbjIgVXpvcjIiLCJpYXQiOjE3NDk4MTE0NDUsImV4cCI6MTc0OTgxNTA0NSwiYXVkIjoiYXVkaWVuY2UiLCJpc3MiOiJpc3N1ZXIifQ.BOafikZHTNDfysZH3M_zYfmGTqDzLwd7OyK8scX_8Bo',
//       )
//       .send({
//         amount: 1,
//         senderEmail: 'bojack@horseman.com',
//         recipientEmail: 'amaben@gmail2.com',
//       });

//     expect(res.status).toBe(201);
//     expect(res.body).toEqual({
//       data: {
//         success: true,
//       },
//     });
//   }, 20000);

//   it('fails if balance is insufficient', async () => {
//     const res = await request(app.getHttpServer())
//       .post('/receive')
//       .set(
//         'Authorization',
//         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoiYW1hYmVuQGdtYWlsMi5jb20iLCJ1c2VyTmFtZSI6IkJlbjIgVXpvcjIiLCJpYXQiOjE3NDk4MTE0NDUsImV4cCI6MTc0OTgxNTA0NSwiYXVkIjoiYXVkaWVuY2UiLCJpc3MiOiJpc3N1ZXIifQ.BOafikZHTNDfysZH3M_zYfmGTqDzLwd7OyK8scX_8Bo',
//       )
//       .send({
//         amount: 9999,
//         senderEmail: 'bojack@horseman.com',
//         recipientEmail: 'amaben@gmail2.com',
//       });

//     expect(res.status).toBe(400);
//     // expect(res.body.message).toContain('Insufficient funds');
//   }, 20000);
// });
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
      amount: 10000000,
      senderEmail: senderEmail,
      recipientEmail: recipientEmail,
    });

    console.log(res.body);

    expect(res.status).toBe(400);
    expect(res?.body?.message as string).toContain('Insufficient');
  });
});
