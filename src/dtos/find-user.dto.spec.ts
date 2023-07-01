import { FindUserDto } from './find-user.dto';
import { validate } from 'class-validator';
import { ValidationError } from '@nestjs/common';

describe('FindUserDto', (): void => {
  describe('id', (): void => {
    it('should be uuid', (done: jest.DoneCallback): void => {
      const dto = new FindUserDto();
      dto.id = 'b115a053-76f3-4d1d-b962-3ee3b07bf9af';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(0);
        done();
      });
    });

    it('should throw error when empty', (done: jest.DoneCallback): void => {
      const dto = new FindUserDto();
      dto.id = '';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(1);
        expect(error[0].constraints.isUuid).toBeDefined();
        done();
      });
    });

    it('should throw error when undefined', (done: jest.DoneCallback): void => {
      const dto = new FindUserDto();
      dto.id = undefined;
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(1);
        expect(error[0].constraints.isUuid).toBeDefined();
        done();
      });
    });

    it('should throw error when not uuid', (done: jest.DoneCallback): void => {
      const dto = new FindUserDto();
      dto.id = '123';
      validate(dto).then((error: ValidationError[]): void => {
        expect(error.length).toBe(1);
        expect(error[0].constraints.isUuid).toBeDefined();
        done();
      });
    });
  });
});
