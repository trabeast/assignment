import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for user creation. Name, email, and password should be provided.
 */
export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
