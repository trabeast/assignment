import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { IsName } from '../custom-validation/name-constraint';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsOptional()
  @IsName()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  password: string;
}
