import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PostCreateDto } from './post-create.dto';

export class CreateManyPostDto {
  @ValidateNested({ each: true })
  @Type(() => PostCreateDto)
  posts: PostCreateDto[];
}
