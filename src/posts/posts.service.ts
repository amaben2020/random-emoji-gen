import { Injectable } from '@nestjs/common';
import { PostCreateDto } from './post-create.dto';

@Injectable()
export class PostsService {
  findAll() {
    return ['These are your posts!'];
  }

  createPost(postData: PostCreateDto) {
    return `Created a new ${postData.postType} with the title "${postData.title}"`;
  }
}
