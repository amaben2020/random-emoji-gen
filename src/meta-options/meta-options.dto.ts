import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class MetaOptionsDto {
  @ApiProperty({
    description: 'JSON',
  })
  @IsString()
  metaValue: string;

  @IsDate()
  createDate?: Date;

  @IsDate()
  updateDate?: Date;
}
