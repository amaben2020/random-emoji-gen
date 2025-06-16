import { Test, TestingModule } from '@nestjs/testing';

import { TagsService } from './tags.service';
import { Tag } from './tag.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository } from 'test/__mocks__/mockRepository';
import { Repository } from 'typeorm';

describe('TagsService', () => {
  let service: TagsService;
  let mockTagRepository: jest.Mocked<Repository<Tag>>;

  beforeEach(async () => {
    mockTagRepository = createMockRepository<Tag>() as unknown as jest.Mocked<
      Repository<Tag>
    >;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useValue: mockTagRepository,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
