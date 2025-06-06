import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(map((data) => ({ data: this.removeSensitiveFields(data) })));
  }

  private removeSensitiveFields(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeSensitiveFields(item));
    }

    if (obj && typeof obj === 'object') {
      const result = { ...obj };
      delete result.password;

      for (const key in result) {
        if (typeof result[key] === 'object') {
          result[key] = this.removeSensitiveFields(result[key]);
        }
      }

      return result;
    }

    return obj;
  }
}
