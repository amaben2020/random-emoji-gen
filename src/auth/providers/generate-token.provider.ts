import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import jwtConfig from '../config/jwtConfig';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService,
  ) {}

  public async generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      userName: user.firstName + ' ' + user.lastName,
    };
    return {
      ...user,
      accessToken: await this.jwtService.signAsync(
        {
          ...payload,
        },
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.accessTokenTtl,
        },
      ),
    };
  }
}
