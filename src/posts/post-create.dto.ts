import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
// always remember

import { MetaOption } from 'src/meta-options/meta-options.entity';
import { Tag } from 'src/tags/tag.entity';

export enum Status {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  REVIEW = 'review',
  PUBLISHED = 'published',
}

export enum PostType {
  POST = 'post',
  PAGE = 'page',
  STORY = 'story',
  SERIES = 'series',
}

export class PostCreateDto {
  @ApiProperty({
    type: String,
    description: 'Title',
    example: 'My Post Title',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @ApiProperty({
    type: String,
    description: 'Post Type',
    example: 'post',
  })
  @IsNotEmpty()
  @IsEnum(PostType)
  postType: PostType;

  @ApiPropertyOptional({
    type: String,
    description: 'Slug',
    example: 'my-post-slug',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be a valid url',
  })
  slug: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Status',
    example: 'draft',
  })
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @ApiPropertyOptional({ type: String, description: 'Content' })
  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  schema: string;

  @IsString()
  @IsOptional()
  @IsUrl({ require_tld: false })
  featuredImageUrl?: string;

  @IsDateString()
  publishOn?: Date;

  @ApiProperty({
    type: 'array',
    description: 'Tags',
    required: true,
    example: ['tag-id-1', 'tag-id-2', 'tag-id-3'],
  })
  @IsOptional()
  @IsArray({ each: true })
  tags?: string[];

  //Nested object [{key:string,value:any},...]
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => MetaOptionDto)
  // metaOptions: MetaOptionDto[];

  @ApiPropertyOptional({ type: JSON })
  @IsOptional()
  metaOptions?: MetaOption;

  @ApiProperty({
    type: 'integer',
    description: 'The author of the post',
    required: true,
    example: 1,
  })
  @IsNumber()
  authorId: number;
}
