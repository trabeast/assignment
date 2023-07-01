import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectionToken, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', (): void => {
  let authService: AuthService;
  const mockedConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'CLIENT_ID':
          return 'client_id';
        case 'CLIENT_SECRET':
          return 'client_secret';
      }
    }),
  };

  const mockedJwtService = {
    signAsync: jest.fn((payload: any): Promise<any> => {
      return Promise.resolve('access_token');
    }),
  };

  beforeEach(async (): Promise<void> => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token: InjectionToken) => {
        switch (token) {
          case ConfigService:
            return mockedConfigService;
          case JwtService:
            return mockedJwtService;
        }
      })
      .compile();
    authService = app.get<AuthService>(AuthService);
  });

  describe('generateToken', (): void => {
    it('should return an object with access_token property when client id and client secret pair is correct', (done: jest.DoneCallback): void => {
      authService.generateToken('client_id:client_secret').then((obj): void => {
        expect(obj.access_token).toBe('access_token');
        done();
      });
    });

    it('should throw unauthorized error if client id is incorrect', async (): Promise<void> => {
      await expect(
        authService.generateToken('wrong_client_id:client_secret'),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw unauthorized error if client secret is incorrect', async (): Promise<void> => {
      await expect(
        authService.generateToken('client_id:wrong_client_secret'),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
