import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/**
 * Handles JWT generation used for authenticating api calls.
 */
@Injectable()
export class AuthService {
  clientId: string;
  clientSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.clientId = this.configService.get('CLIENT_ID');
    this.clientSecret = this.configService.get('CLIENT_SECRET');
  }

  /**
   * Generates a JWT to be used to authorize requests.
   * @param {string} authorization the client id
   * @returns {Promise<any>} object with access token property.
   */
  async generateToken(authorization: string): Promise<any> {
    const encodedCred = btoa(`${this.clientId}:${this.clientSecret}`);
    console.log(encodedCred, authorization);
    if (!authorization.includes(encodedCred)) {
      throw new UnauthorizedException();
    }

    const payload = { id: this.clientId, secret: this.clientSecret };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
