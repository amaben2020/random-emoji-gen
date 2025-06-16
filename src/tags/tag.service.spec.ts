/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { TagsService } from './tags.service';
import { Tag } from './tag.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository } from 'test/__mocks__/mockRepository';
import { In, Repository } from 'typeorm';

const tags = [
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
];

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
    mockTagRepository.find.mockResolvedValue(tags);
    const result = await service.getTags();

    // after the service has been called, we affirm that the mocks were called also
    expect(mockTagRepository.find).toHaveBeenCalled();
    expect(result.length).toBe(2);
    expect(result[0].title).toBe('Test Title');
    expect(result[1].slug).toBe('test-slug-2');
    expect(result[1].description).toBe('Test Description 2');
  });

  it('should find tags by ids', async () => {
    const ids = ['1', '2'];
    // step 1: seed the db with this
    mockTagRepository.find.mockResolvedValue(tags);

    //step 2: call the service
    await service.findByTagIds(ids);

    // mock the find function
    expect(mockTagRepository.find).toHaveBeenCalledWith({
      where: {
        id: In(ids),
      },
    });
  });

  it('should create new tags', async () => {
    const createDto = {
      title: 'Test Title',
      slug: 'test-slug',
      description: 'Test Description',
    };

    const createdEntity = {
      ...createDto,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      posts: [],
    };

    mockTagRepository.create.mockReturnValue(createdEntity);
    mockTagRepository.save.mockResolvedValue(createdEntity);

    mockTagRepository.find.mockResolvedValue(tags);

    mockTagRepository.create.mockReturnValue(createdEntity);
    mockTagRepository.save.mockResolvedValue(createdEntity);

    const result = await service.create(createDto);

    expect(mockTagRepository.create).toHaveBeenCalledWith(createDto);
    expect(mockTagRepository.save).toHaveBeenCalledWith(createdEntity);
    expect(result).toMatchObject(createdEntity);
    // If your test still fails due to Date objects or deep reference issues, use .toMatchObject() instead of .toEqual() or write a partial matcher
    expect(result).toEqual(createdEntity);
  });
});
