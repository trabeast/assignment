import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  HttpStatus,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Users } from '../src/entities/users.entity';
import { UserService } from '../src/services/user.service';
import { AuthService } from '../src/services/auth.service';
import { AuthGuard, IS_PUBLIC_KEY } from '../src/authentication';
import { Reflector } from '@nestjs/core';
import { CreateUserDto } from '../src/dtos/create-user.dto';
import { UpdateUserDto } from '../src/dtos/update-user.dto';

describe('Application (e2e)', (): void => {
  let app: INestApplication;
  const mockUserService = {
    find: async (id: string): Promise<Users> => {
      const user = new Users();
      user.id = id;
      user.name = 'firstname lastname';
      user.email = 'test@email.com';
      user.password = 'password';
      return Promise.resolve(user);
    },
    add: async (dto: CreateUserDto): Promise<Users> => {
      const user = new Users();
      user.name = dto.name;
      user.email = dto.email;
      user.password = dto.password;
      user.id = 'new-id';
      return Promise.resolve(user);
    },
    update: async (dto: UpdateUserDto, id: string): Promise<Users> => {
      const user = new Users();
      user.name = dto.name;
      user.email = dto.email;
      user.password = dto.password;
      user.id = id;
      return Promise.resolve(user);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete: async (id: string): Promise<void> => Promise.resolve(),
  };
  const mockAuthService = {
    generateToken: async (): Promise<any> => {
      return Promise.resolve({
        access_token: 'access_token',
      });
    },
  };

  class mockAuthGuard {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        return Promise.resolve(true);
      }

      const request = context.switchToHttp().getRequest();
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      const accessToken = type === 'Bearer' ? token : undefined;
      if (!accessToken || accessToken !== 'access_token') {
        throw new UnauthorizedException();
      }
      return Promise.resolve(true);
    }
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('AuthController', (): void => {
    it('/GET auth', () => {
      return request(app.getHttpServer())
        .get('/auth')
        .expect(HttpStatus.OK)
        .expect({ access_token: 'access_token' });
    });
  });

  describe('UserController', (): void => {
    it('/GET users', () => {
      const id = 'b4723d5d-d4b4-4d23-bb19-b9b52d7886fe';
      return request(app.getHttpServer())
        .get(`/users/${id}`)
        .auth('access_token', { type: 'bearer' })
        .expect(HttpStatus.OK)
        .expect({
          id: id,
          name: 'firstname lastname',
          email: 'test@email.com',
        });
    });

    it('/POST users', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'firstname lastname',
          email: 'test@email.com',
          password: 'password',
        })
        .expect(HttpStatus.CREATED)
        .expect({
          id: 'new-id',
          name: 'firstname lastname',
          email: 'test@email.com',
        });
    });

    it('/PATCH users/:id', () => {
      const id = 'b4723d5d-d4b4-4d23-bb19-b9b52d7886fe';
      return request(app.getHttpServer())
        .patch(`/users/${id}`)
        .send({
          name: 'updated name',
          email: 'updated@email.com',
          password: 'updated_password',
        })
        .expect(HttpStatus.OK)
        .expect({
          id: id,
          name: 'updated name',
          email: 'updated@email.com',
        });
    });

    it('/DELETE users/:id', () => {
      const id = 'b4723d5d-d4b4-4d23-bb19-b9b52d7886fe';
      return request(app.getHttpServer())
        .delete(`/users/${id}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  afterAll(async () => await app.close());
});
