import { Injectable } from '@nestjs/common';
import { PostCreateDto } from './post-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Post)
    private metaOptionRepository: Repository<MetaOption>,
  ) {}
  findAll() {
    return ['These are your posts!'];
  }

  async createPost(postData: PostCreateDto) {
    // create a metaOption object and save it to the database
    const metaOption = postData.metaOptions
      ? this.metaOptionRepository.create()
      : null;

    console.log('metaOption ===>', metaOption);

    // if metaOption property is available in postDataDto, attach the metaOption to the post entity
    if (metaOption) {
      await this.metaOptionRepository.save(postData.metaOptions);
    }
    return this.postRepository.save(postData);
  }
}
