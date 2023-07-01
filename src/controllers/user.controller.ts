import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Users } from '../entities/users.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserService } from '../services/user.service';
import { FindUserDto } from '../dtos/find-user.dto';

/**
 * Handles CRUD related operations for user entity.
 */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a user with name, email, and password.
   * @param {CreateUserDto} dto is the user data transfer object for create.
   * Name, email, and password should be provided.
   * @returns {Users} the newly created user.
   */
  @Post()
  @Header('Content-Type', 'application/json')
  @HttpCode(201)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() dto: CreateUserDto): Promise<Users> {
    return this.userService.add(dto);
  }

  /**
   * Retrieve a user by id.
   * @param {FindUserDto} dto is the data transfer object for find by id.
   * @returns {Users} the target user entity if found; otherwise throw not found
   * error.
   */
  @Get(':id')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  retrieve(@Param() dto: FindUserDto): Promise<Users> {
    return this.userService.find(dto.id);
  }

  /**
   * Update user's name, email, and/or password.
   * @param {UpdateUserDto} updateUserDto is the user data transfer object for update. Name, email, and
   * @param {FindUserDto} findUserDto is the data transfer object for find by id.
   * password are all optional.
   * @returns {Users} the updated target user.
   */
  @Patch(':id')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param() findUserDto: FindUserDto,
  ): Promise<Users> {
    return this.userService.update(updateUserDto, findUserDto.id);
  }

  /**
   * Delete user.
   * @param {FindUserDto} dto is the data transfer object for find by id.
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() dto: FindUserDto): Promise<void> {
    await this.userService.delete(dto.id);
  }
}
