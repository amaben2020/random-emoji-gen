import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PostCreateDto } from './post-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: {
        author: true,
      },
    });
  }

  public async createPost(postData: PostCreateDto) {
    try {
      console.log('Author Id', postData.authorId);
      const author = await this.usersService.findOneById(postData.authorId);
      console.log(author);

      if (!author?.id) {
        throw new Error(`Author with ID ${postData.authorId} not found`);
      }
      // creates a new instance
      const post = this.postRepository.create({
        ...postData,
        metaOptions: postData.metaOptions || {},
        author,
      });

      return await this.postRepository.save(post);
    } catch (error) {
      console.error('Error creating post:', error);

      throw new BadRequestException('Post already exists');
    }
  }

  public async deletePost(id: number) {
    await this.postRepository.delete(id);

    return { deleted: true, id };
  }
}
