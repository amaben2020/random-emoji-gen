import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MetaOptionsDto {
  @ApiProperty({
    description: 'JSON',
  })
  @IsString()
  metaValue: string;
}
