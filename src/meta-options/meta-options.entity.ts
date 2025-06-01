import { IsDate, IsJSON } from 'class-validator';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MetaOption {
  @PrimaryGeneratedColumn()
  id: number;

  @IsJSON()
  metaValue: string;

  @IsDate()
  createDate: Date;

  @IsDate()
  updateDate: Date;
}
