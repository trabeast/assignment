import { CreateUserDto } from './create-user.dto';
import { validate } from 'class-validator';

describe('CreateUserDto', () => {
  describe('name', () => {
    it('should not throw error when alpha', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@email.com';
      dto.password = 'password';
      dto.name = 'name';
      const error = await validate(dto);
      expect(error.length).toBe(0);
    });

    it('should throw error when empty or undefined', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@email.com';
      dto.password = 'password';

      dto.name = '';
      const emptyError = await validate(dto);
      expect(emptyError.length).toBe(1);
      expect(emptyError[0].constraints.isNotEmpty).toBeDefined();
      expect(emptyError[0].constraints.isNotEmpty).toContain('name');

      dto.name = undefined;
      const undefinedError = await validate(dto);
      expect(undefinedError.length).toBe(1);
      expect(undefinedError[0].constraints.isNotEmpty).toBeDefined();
      expect(undefinedError[0].constraints.isNotEmpty).toContain('name');
    });

    // it('should throw error when not alpha', async () => {
    //   const dto = new CreateUserDto();
    //   dto.email = 'test@email.com';
    //   dto.password = 'password';
    //   dto.name = '1123';
    //   const error = await validate(dto);
    //   expect(error.length).toBe(1);
    //   expect(error[0].constraints.isAlpha).toBeDefined();
    //   expect(error[0].constraints.isAlpha).toContain('name');
    // });
  });

  describe('email', () => {
    it('should not throw error when correct format', async () => {
      const dto = new CreateUserDto();
      dto.name = 'name';
      dto.password = 'password';
      dto.email = 'test@email.com';
      const error = await validate(dto);
      expect(error.length).toBe(0);
    });

    it('should throw error when empty', async () => {
      const dto = new CreateUserDto();
      dto.name = 'name';
      dto.password = 'password';

      dto.email = '';
      const emptyError = await validate(dto);
      expect(emptyError.length).toBe(1);
      expect(emptyError[0].constraints.isEmail).toBeDefined();

      dto.email = undefined;
      const undefinedError = await validate(dto);
      expect(undefinedError.length).toBe(1);
      expect(undefinedError[0].constraints.isEmail).toBeDefined();
      expect(undefinedError[0].constraints.isEmail).toContain('email');
    });

    it('should throw error when incorrect format', async () => {
      const dto = new CreateUserDto();
      dto.name = 'name';
      dto.password = 'password';

      dto.email = 'test*email.com';
      const error = await validate(dto);
      expect(error.length).toBe(1);
      expect(error[0].constraints.isEmail).toBeDefined();
      expect(error[0].constraints.isEmail).toContain('email');
    });
  });

  describe('password', () => {
    it('should not throw error when present', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@email.com';
      dto.name = 'name';
      dto.password = 'password';
      const error = await validate(dto);
      expect(error.length).toBe(0);
    });

    it('should throw error when empty or undefined', async () => {
      const dto = new CreateUserDto();
      dto.name = 'name';
      dto.email = 'test@email.com';

      dto.password = '';
      const emptyError = await validate(dto);
      expect(emptyError.length).toBe(1);
      expect(emptyError[0].constraints.isNotEmpty).toBeDefined();
      expect(emptyError[0].constraints.isNotEmpty).toContain('password');

      dto.password = undefined;
      const undefinedError = await validate(dto);
      expect(undefinedError.length).toBe(1);
      expect(undefinedError[0].constraints.isNotEmpty).toBeDefined();
      expect(undefinedError[0].constraints.isNotEmpty).toContain('password');
    });
  });
});
