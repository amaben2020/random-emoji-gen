import { createMock } from '@golevelup/ts-jest';
import { AuthGuard } from './auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { LoggerService } from '../../logger.service';

describe('AuthGuard', () => {
  const authGuard = new AuthGuard(new LoggerService());
  const context = createMock<ExecutionContext>({
    switchToHttp: () => ({
      getRequest: () => ({
        header: () => 'SECRET',
        headers: {
          'x-api-key': 'SECRET',
        },
      }),
    }),
  });

  const result = authGuard.canActivate(context);

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should return true IF the secret is correct', () => {
    expect(result).toBe(true);
  });
});
