import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from './meta-options.entity';
import { Repository } from 'typeorm';
// import { MetaOptionDto } from 'src/posts/post-create.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  create(metaOptionData: MetaOption): Promise<any> {
    return this.metaOptionRepository.save(metaOptionData);
  }

  getMetaOptions(): Promise<MetaOption[]> {
    return this.metaOptionRepository.find();
  }
}
