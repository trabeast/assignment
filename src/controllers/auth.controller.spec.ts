import { AuthController } from './auth.controller';
import { Request } from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectionToken } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

describe('AuthController', (): void => {
  let authController: AuthController;
  const mockedAuthService = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    generateToken: jest.fn(async (req: Request): Promise<any> => {
      return {
        access_token: 'access_token',
      };
    }),
  };

  beforeEach(async (): Promise<void> => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token: InjectionToken) => {
        if (token == AuthService) {
          return mockedAuthService;
        }
      })
      .compile();
    authController = app.get<AuthController>(AuthController);
  });

  describe('auth', (): void => {
    it('should return object with access_token property', (done: jest.DoneCallback): void => {
      authController
        .auth({
          headers: {
            authorization: 'authorization',
          },
        } as Request)
        .then((res) => {
          expect(res.access_token).toBe('access_token');
          done();
        });
    });
  });
});
