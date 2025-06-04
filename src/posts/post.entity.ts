import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostType, Status } from './post-create.dto';
import { MetaOption } from 'src/meta-options/meta-options.entity';

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
    nullable: true,
  })
  postType: PostType;

  @Column({
    type: 'varchar',
    unique: true,
    length: 256,
    nullable: false,
    default: '',
  })
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

  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  metaOptions?: MetaOption;
}
