import { UpdateUserDto } from './update-user.dto';
import { validate } from 'class-validator';
import { ValidationError } from '@nestjs/common';

describe('UpdateUserDto', (): void => {
  describe('name', (): void => {
    it('should be optional', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.email = 'test@email.com';
      dto.password = 'password';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(0);
        done();
      });
    });

    it('should not be empty when present', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.name = '';
      dto.email = 'test@email.com';
      dto.password = 'password';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(1);
        expect(error[0].constraints.isNotEmpty).toBeDefined();
        done();
      });
    });

    it('should not throw error when present', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.name = 'firstname lastname';
      dto.email = 'test@email.com';
      dto.password = 'password';
      validate(dto).then((error) => {
        expect(error.length).toBe(0);
        done();
      });
    });

    it('should throw error when number is present', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.email = 'test@email.com';
      dto.password = 'password';

      dto.name = 'Name123';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(1);
        expect(error[0].constraints.isName).toBeDefined();
        expect(error[0].constraints.isName).toContain('name');
        done();
      });
    });

    it('should throw error when special characters is present', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.email = 'test@email.com';
      dto.password = 'password';

      dto.name = 'Name*->';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(1);
        expect(error[0].constraints.isName).toBeDefined();
        expect(error[0].constraints.isName).toContain('name');
        done();
      });
    });
  });

  describe('email', (): void => {
    it('should not throw error when correct format', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.name = 'name';
      dto.password = 'password';
      dto.email = 'test@email.com';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(0);
        done();
      });
    });

    it('should throw error when empty', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.name = 'name';
      dto.password = 'password';

      dto.email = '';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(1);
        expect(error[0].constraints.isEmail).toBeDefined();
        done();
      });
    });

    it('should be optional', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.name = 'name';
      dto.password = 'password';

      dto.email = undefined;
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(0);
        done();
      });
    });

    it('should throw error when incorrect format', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.name = 'name';
      dto.password = 'password';

      dto.email = 'test*email.com';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(1);
        expect(error[0].constraints.isEmail).toBeDefined();
        expect(error[0].constraints.isEmail).toContain('email');
        done();
      });
    });
  });

  describe('password', (): void => {
    it('should not throw error when present', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.email = 'test@email.com';
      dto.name = 'name';
      dto.password = 'password';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(0);
        done();
      });
    });

    it('should throw error when empty', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.name = 'name';
      dto.email = 'test@email.com';

      dto.password = '';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(1);
        expect(error[0].constraints.isNotEmpty).toBeDefined();
        expect(error[0].constraints.isNotEmpty).toContain('password');
        done();
      });
    });

    it('should be optional', (done: jest.DoneCallback): void => {
      const dto = new UpdateUserDto();
      dto.name = 'name';
      dto.email = 'test@email.com';

      dto.password = undefined;
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(0);
        done();
      });
    });
  });
});
