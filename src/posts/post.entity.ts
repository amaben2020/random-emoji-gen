import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MetaOptionDto, PostType, Status } from './post-create.dto';
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 256, nullable: false })
  title: string;

  @Column({
    type: 'enum',
    enum: PostType,
    enumName: 'post_type_enum',
    default: PostType.PAGE,
    nullable: false,
  })
  postType: PostType;

  @Column({ type: 'varchar', unique: true, length: 256, nullable: false })
  slug: string;

  @Column({
    type: 'enum',
    enum: Status,
    enumName: 'post_status_enum',
    default: Status.DRAFT,
    nullable: false,
  })
  status: Status;

  @Column('text')
  content?: string;

  @Column('json')
  schema?: string;

  @Column({ type: 'varchar', nullable: true })
  featuredImageUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  publishOn?: Date;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'json', nullable: true })
  metaOptions?: MetaOptionDto[];
}
