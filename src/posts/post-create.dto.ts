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
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsNotEmpty()
  @IsEnum(PostType)
  postType: PostType;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be a valid url',
  })
  slug: string;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

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

  @IsArray()
  @IsOptional()
  @MinLength(3, { each: true })
  @IsString({ each: true })
  tags: string[];

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
    type: Number,
    description: 'The author of the post',
  })
  @IsNumber()
  authorId: number;
}
