import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      if (!tagIds.length) {
        throw new BadRequestException('No ids provided');
      }
      const result = await this.tagRepository.find({
        where: {
          id: In(tagIds),
        },
      });

      if (!result.length) {
        throw new NotFoundException('No tags found');
      }

      return result;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Tag not found');
    }
  }

  async create(createTagDto: CreateTagDto) {
    try {
      const newTag = this.tagRepository.create(createTagDto);
      const savedTag = await this.tagRepository.save(newTag);

      return savedTag;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
