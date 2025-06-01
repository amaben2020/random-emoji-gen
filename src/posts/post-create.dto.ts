// import { Type } from 'class-transformer';
import {
  IsArray,
  // IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  // ValidateNested,
} from 'class-validator';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { JoinColumn, OneToOne } from 'typeorm';

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

// export class MetaOptionDto {
//   @IsString()
//   @IsNotEmpty()
//   key: string;

//   @IsNotEmpty()
//   value: any;
// }

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

  @OneToOne(() => MetaOption)
  @JoinColumn()
  metaOptions: MetaOption;
}
