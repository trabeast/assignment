import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsName } from '../custom-validation/name-constraint';

/**
 * Data transfer object for user creation. Name, email, and password should be provided.
 */
export class CreateUserDto {
  @IsNotEmpty()
  @IsName()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
