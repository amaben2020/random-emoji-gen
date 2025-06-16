import { Repository } from 'typeorm';

export const createMockRepository = <T extends object>(): jest.Mocked<
  Partial<Repository<T>>
> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
  findOneBy: jest.fn(),
  findBy: jest.fn(),
  count: jest.fn(),
  findAndCount: jest.fn(),
  findOneOrFail: jest.fn(),
  query: jest.fn(),
  clear: jest.fn(),
});
