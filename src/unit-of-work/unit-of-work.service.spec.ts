import { Test, TestingModule } from '@nestjs/testing';
import { UnitOfWorkService } from './unit-of-work.service';
import { DataSource } from 'typeorm';

describe('UnitOfWorkService', () => {
  let service: UnitOfWorkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitOfWorkService,
        {
          provide: DataSource,
          useValue: {}, // mock DataSource
        },
      ],
    }).compile();

    service = module.get<UnitOfWorkService>(UnitOfWorkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
