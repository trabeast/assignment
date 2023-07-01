import { UserController } from './user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { Users } from '../entities/users.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { InjectionToken } from '@nestjs/common';
import { FindUserDto } from '../dtos/find-user.dto';

describe('UserController', (): void => {
  let userController: UserController;
  const mockedUserService = {
    add: jest.fn(async (dto: CreateUserDto): Promise<Users> => {
      const user = new Users();
      user.id = 'uuid';
      user.name = dto.name;
      user.email = dto.email;
      user.password = dto.password;
      return Promise.resolve(user);
    }),
    find: jest.fn(async (id: string): Promise<Users> => {
      const user = new Users();
      user.id = id;
      user.name = 'retrieved-name';
      user.email = 'retrieved@email.com';
      user.password = 'retrieved-password';
      return Promise.resolve(user);
    }),
    update: jest.fn(async (dto: UpdateUserDto, id: string): Promise<Users> => {
      const user = new Users();
      user.id = id;
      user.name = dto.name;
      user.email = dto.email;
      user.password = dto.password;
      return Promise.resolve(user);
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete: jest.fn(async (id: string): Promise<void> => {
      await Promise.resolve();
    }),
  };

  beforeEach(async (): Promise<void> => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .useMocker((token: InjectionToken) => {
        if (token === UserService) {
          return mockedUserService;
        }
      })
      .compile();
    userController = app.get<UserController>(UserController);
  });

  describe('create', (): void => {
    it('should return created user without password', (done: jest.DoneCallback): void => {
      userController
        .create({
          name: 'name',
          email: 'email',
          password: 'password',
        } as CreateUserDto)
        .then((user: Users): void => {
          expect(user.id).toBeDefined();
          expect(user.name).toBe('name');
          expect(user.email).toBe('email');
          expect(user.password).toBe('password');
          done();
        });
    });
  });

  describe('retrieve', (): void => {
    it('should return user by id', (done: jest.DoneCallback): void => {
      userController
        .retrieve({ id: 'id-01' } as FindUserDto)
        .then((user: Users): void => {
          expect(user.id).toBe('id-01');
          expect(user.name).toBe('retrieved-name');
          expect(user.email).toBe('retrieved@email.com');
          expect(user.password).toBe('retrieved-password');
          done();
        });
    });
  });

  describe('update', (): void => {
    it('should return updated user', (done: jest.DoneCallback): void => {
      userController
        .update(
          {
            name: 'updated name',
            email: 'updated email',
            password: 'updated password',
          } as UpdateUserDto,
          { id: 'id-01' } as FindUserDto,
        )
        .then((user: Users): void => {
          expect(user.id).toBe('id-01');
          expect(user.name).toBe('updated name');
          expect(user.email).toBe('updated email');
          expect(user.password).toBe('updated password');
          done();
        });
    });
  });

  describe('delete', (): void => {
    it('should call method to delete database entry', (done: jest.DoneCallback): void => {
      const userServiceSpy: jest.SpyInstance<Promise<void>> = jest.spyOn(
        mockedUserService,
        'delete',
      );
      userController.delete({ id: 'id-01' } as FindUserDto).then((): void => {
        expect(userServiceSpy).toHaveBeenCalled();
        done();
      });
    });
  });
});
