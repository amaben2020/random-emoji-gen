import { SetMetadata } from '@nestjs/common';

export const AdminDecorator = (...args: string[]) => SetMetadata('admin', args);
