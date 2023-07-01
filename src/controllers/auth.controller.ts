import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request } from 'express';

/**
 * Handles generation of access token.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Generates access token.
   * @param {Request} req
   * @returns {Promise<any>} the object containing access token.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async auth(@Req() req: Request): Promise<any> {
    return this.authService.generateToken(req.headers.authorization);
  }
}
