import { Controller, Get, Inject } from '@nestjs/common';
import { MetaOptionsService } from './meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(
    @Inject(MetaOptionsService)
    private readonly metaOptionsService: MetaOptionsService,
  ) {}

  @Get()
  getMetaOptions() {
    return this.metaOptionsService.getMetaOptions();
  }
}
