import { Injectable } from '@nestjs/common';
import { PostCreateDto } from './post-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
  findAll() {
    return ['These are your posts!'];
  }

  createPost(postData: PostCreateDto) {
    return this.postRepository.save(postData);
  }
}
