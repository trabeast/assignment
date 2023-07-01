import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isName' })
@Injectable()
export class NameConstraint implements ValidatorConstraintInterface {
  validate(value: string, validationArguments?: ValidationArguments): boolean {
    return /^[a-zA-Z ]+$/.test(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} is not a valid name. Avoid non-alpha characters.`;
  }
}

export function IsName() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: NameConstraint,
    });
  };
}
