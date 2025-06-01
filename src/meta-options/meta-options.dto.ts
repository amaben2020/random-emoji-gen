import { ApiProperty } from '@nestjs/swagger';

export class MetaOptionsDto {
  @ApiProperty({
    description: 'JSON',
  })
  metaValue: string;

  @ApiProperty()
  createDate?: Date;

  @ApiProperty()
  updateDate?: Date;
}
