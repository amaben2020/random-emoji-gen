import { BadRequestException, Injectable } from '@nestjs/common';
import { Tag } from './tag.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from './tags-create.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getTags(): Promise<Tag[]> {
    try {
      return await this.tagRepository.find();
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  public async findByTagIds(tagIds: string[]) {
    try {
      if (!tagIds.length) return [];
      return await this.tagRepository.find({
        where: {
          id: In(tagIds),
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async create(createTagDto: CreateTagDto) {
    const newTag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(newTag);
  }
}
