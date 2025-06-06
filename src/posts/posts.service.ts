import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PostCreateDto } from './post-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { TagsService } from 'src/tags/tags.service';
import { CreateManyPostDto } from './create-many-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private readonly tagsService: TagsService,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: {
        author: true,
        tags: true,
        metaOptions: true,
      },
    });
  }

  public async createPost(postData: PostCreateDto) {
    try {
      const author = await this.usersService.findOneById(postData.authorId);
      const tags = await this.tagsService.findByTagIds(postData?.tags ?? []);
      console.log('TAGS ===>', tags);

      if (!author?.id) {
        throw new Error(`Author with ID ${postData.authorId} not found`);
      }

      // creates a new instance
      const post = this.postRepository.create({
        ...postData,
        metaOptions: postData.metaOptions || {},
        author,
        tags,
      });

      return await this.postRepository.save(post);
    } catch (error) {
      console.error('Error creating post:', error);

      throw new BadRequestException('Post already exists');
    }
  }

  public async createManyPosts(manyPostsDto: CreateManyPostDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const postDto of manyPostsDto.posts) {
        // Get the author
        const author = await this.usersService.findOneById(postDto.authorId);
        if (!author?.id) {
          throw new Error(`Author with ID ${postDto.authorId} not found`);
        }

        // Get the tags
        const tags = await this.tagsService.findByTagIds(postDto?.tags ?? []);

        // Create the post with proper entity relationships
        const newPost = queryRunner.manager.create(Post, {
          ...postDto,
          metaOptions: postDto.metaOptions || {},
          author,
          tags,
        });

        await queryRunner.manager.save(newPost);
      }

      await queryRunner.commitTransaction();

      return {
        message: `Posts created successfully`,
      };
    } catch (err) {
      console.log('ERROR ===>', err);
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new ConflictException();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  public async updatePost(id: number, postData: Partial<PostCreateDto>) {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id,
        },
        relations: {
          metaOptions: true,
        },
      });

      if (!post || !postData) {
        throw new Error(`Post with ID ${id} not found`);
      }

      const tagIds = postData.tags || [];
      const tags =
        tagIds.length > 0
          ? await this.tagsService.findByTagIds(tagIds)
          : post.tags;

      post.title = postData?.title ?? post.title;
      post.slug = postData?.slug ?? post.slug;
      post.content = postData?.content ?? post.content;
      post.status = postData?.status ?? post.status;
      post.publishOn = postData?.publishOn ?? post.publishOn;
      post.featuredImageUrl =
        postData?.featuredImageUrl ?? post.featuredImageUrl;
      post.schema = postData?.schema ?? post.schema;

      //if there's existing post metaOptions data
      if (post.metaOptions) {
        if (postData.metaOptions) {
          post.metaOptions.metaValue = postData?.metaOptions.metaValue;
        } else {
          post.metaOptions = postData.metaOptions;
        }
      }

      post.tags = tags;

      // Update author if authorId is provided
      if (postData.authorId) {
        const author = await this.usersService.findOneById(postData.authorId);
        console.log('AUTHOR', author);
        if (author) {
          post.author = author;
        } else {
          throw new BadRequestException('Author not found');
        }
      }

      return await this.postRepository.save(post);
    } catch (error: unknown) {
      console.log(error);

      // Safely extract error message with proper type checking
      let errorMessage = 'Failed to update post';

      if (error && typeof error === 'object') {
        if (
          'response' in error &&
          error.response &&
          typeof error.response === 'object' &&
          'message' in error.response &&
          typeof error.response.message === 'string'
        ) {
          errorMessage = error.response.message;
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }

      throw new BadRequestException(errorMessage);
    }
  }

  // public async updatePost(id: number, postData: Partial<PostCreateDto>) {
  //   try {
  //     // Load the post WITH its metaOptions relationship
  //     const post = await this.postRepository.findOne({
  //       where: { id },
  //       relations: ['metaOptions'], // This is crucial
  //     });

  //     if (!post) {
  //       throw new Error(`Post with ID ${id} not found`);
  //     }

  //     // Handle tags update
  //     const tagIds = postData.tags || [];
  //     const tags =
  //       tagIds.length > 0
  //         ? await this.tagsService.findByTagIds(tagIds)
  //         : post.tags;

  //     // Update post fields
  //     post.title = postData?.title ?? post.title;
  //     post.slug = postData?.slug ?? post.slug;
  //     // ... other post field updates ...

  //     // Handle metaOptions - UPDATE existing or CREATE new if none exists
  //     if (postData.metaOptions) {
  //       if (post.metaOptions) {
  //         // Update existing metaOptions
  //         post.metaOptions.metaValue = postData.metaOptions.metaValue;
  //       } else {
  //         post.metaOptions = postData.metaOptions;
  //       }
  //     }

  //     post.tags = tags;

  //     // Update author if needed
  //     if (postData.authorId) {
  //       const author = await this.usersService.findOneById(postData.authorId);
  //       if (author) {
  //         post.author = author;
  //       }
  //     }

  //     return await this.postRepository.save(post);
  //   } catch (error) {
  //     console.error(error);
  //     throw new BadRequestException('Failed to update post');
  //   }
  // }

  public async deletePost(id: number) {
    await this.postRepository.delete(id);

    return { deleted: true, id };
  }

  public async softRemove(id: number) {
    await this.postRepository.softDelete(id);

    return {
      delete: true,
      id,
    };
  }
}
