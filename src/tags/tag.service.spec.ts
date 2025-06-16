/* eslint-disable @typescript-eslint/unbound-method */
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

  it('should return tags in the database', async () => {
    mockTagRepository.find.mockResolvedValue([
      {
        id: '1',
        title: 'Test Title',
        slug: 'test-slug',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        posts: [],
      },
      {
        id: '2',
        title: 'Test Title 2',
        slug: 'test-slug-2',
        description: 'Test Description 2',
        createdAt: new Date(),
        updatedAt: new Date(),
        posts: [],
      },
    ]);
    const result = await service.getTags();
    expect(mockTagRepository.find).toHaveBeenCalled();
    expect(result.length).toBe(2);
    expect(result[0].title).toBe('Test Title');
    expect(result[1].slug).toBe('test-slug-2');
    expect(result[1].description).toBe('Test Description 2');
  });
});
