import { BadRequestException, Injectable } from '@nestjs/common';
import { PostCreateDto } from './post-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({});
  }

  async createPost(postData: PostCreateDto) {
    try {
      // creates a new instance
      const post = this.postRepository.create({
        ...postData,
        metaOptions: postData.metaOptions || {},
      });

      return await this.postRepository.save(post);
    } catch (error) {
      console.error('Error creating post:', error);

      throw new BadRequestException('Post already exists');
    }
  }
}
