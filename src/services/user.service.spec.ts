import { UserService } from './user.service';
import { Users } from '../entities/users.entity';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InjectionToken,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UserService', (): void => {
  let userService: UserService;
  const mockedUserRepository = {
    insert: jest.fn((user: Users): Promise<any> => {
      return Promise.resolve({
        identifiers: [{ id: 'new-id' }],
      });
    }),
    findOneBy: jest.fn((where: any): Promise<Users> => {
      if (where.id === 'existing-id') {
        const user = new Users();
        user.id = where.id;
        return Promise.resolve(user);
      } else if (where.email === 'existing-email') {
        return Promise.resolve(new Users());
      } else {
        return Promise.resolve(null);
      }
    }),
    update: jest.fn((id: string, user: Users): Promise<any> => {
      return Promise.resolve({
        affected: id === 'existing-id' ? 1 : 0,
      });
    }),
    find: jest.fn((id: string): Promise<Users> => {
      const user = new Users();
      user.id = id;
      return Promise.resolve(user);
    }),
    delete: jest.fn((id: string): Promise<any> => {
      return Promise.resolve({
        affected: id === 'existing-id' ? 1 : 0,
      });
    }),
  };

  beforeEach(async (): Promise<void> => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token: InjectionToken) => {
        if (token === 'UsersRepository') {
          return mockedUserRepository;
        }
      })
      .compile();
    userService = app.get<UserService>(UserService);
  });

  describe('add', (): void => {
    it('should create a user', (done: jest.DoneCallback): void => {
      const newUser = new CreateUserDto();
      newUser.email = 'email';
      newUser.name = 'name';
      newUser.password = 'password';
      userService.add(newUser).then((user: Users) => {
        expect(user.email).toBe(newUser.email);
        expect(user.name).toBe(newUser.name);
        expect(user.password).toBeDefined();
        expect(user.id).toBe('new-id');
        done();
      });
    });

    it('should throw BadRequestException when email already exist', async (): Promise<void> => {
      await expect(
        userService.add({ email: 'existing-email' } as Users),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('find', (): void => {
    it('should retrieve a user by id', (done: jest.DoneCallback): void => {
      userService.find('existing-id').then((user: Users) => {
        expect(user.id).toBe('existing-id');
        done();
      });
    });

    it('should throw error when user with id does not exist', async (): Promise<void> => {
      await expect(userService.find('non-existing-id')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', (): void => {
    it('should update a user', (done: jest.DoneCallback): void => {
      const user = new Users();
      userService.update(user, 'existing-id').then((user: Users) => {
        expect(user.id).toBe('existing-id');
        done();
      });
    });

    it('should throw error when updating user that does not exist', async (): Promise<void> => {
      await expect(
        userService.update(new Users(), 'non-existing-id'),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('delete', (): void => {
    it('should delete a user', async (): Promise<void> => {
      await expect(userService.delete('existing-id')).resolves;
    });

    it('should throw error when deleting user that does not exist', async (): Promise<void> => {
      await expect(userService.delete('non-existing-id')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
