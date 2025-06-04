import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// no need to put date

export class CreateTagDto {
  @ApiProperty({
    type: String,
    description: 'Tag title',
    example: 'tag-title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Tag slug',
    example: 'tag-slug',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    type: String,
    description: 'Tag description',
    example: 'This is tag description.',
  })
  @IsString()
  description: string;
}
