import { JwtModuleAsyncOptions, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('APP_SECRET'),
    global: true,
    signOptions: { expiresIn: configService.get('TOKEN_EXPIRY') },
  }),
  inject: [ConfigService],
};

/**
 * Handles authentication of token on each guarded api calls.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Authenticates token from header.
   * @param {ExecutionContext} context
   * @returns {boolean} true if token passed authentication. Otherwise, false.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('APP_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  /**
   * Extracts the token from 'Authentication' header.
   * @param {Request} request
   * @private
   * @returns {string | undefined} the token if present. Otherwise, undefined.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
