import { IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsString()
  schema?: string;

  // @IsDate()
  // createDate: Date;

  // @IsDate()
  // updateDate: Date;
}
