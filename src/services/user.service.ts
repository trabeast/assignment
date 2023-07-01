import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

/**
 * Converts DTO to user entity and does database operations.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  /**
   * Add a new user data entry.
   * @param {CreateUserDto} dto is the user data transfer object for create.
   * Should have name, email and password.
   * @returns {Users} the newly created user data entry.
   */
  async add(dto: CreateUserDto): Promise<Users> {
    const user = await this.convertToEntity(dto);
    const result = await this.usersRepository.insert(user);
    user.id = result.identifiers[0].id;
    return user;
  }

  /**
   * Retrieve either a single user when id is provided. Otherwise, retrieve all
   * users.
   * @param {string} id the unique user identifier.
   * @returns {Users}
   */
  async find(id: string): Promise<Users> {
    return await this.usersRepository.findOneBy({ id: id });
  }

  /**
   * Update user data entry by id.
   * @param {UpdateUserDto} dto the data transfer object for update.
   * Should have either/both/or all name, email, or password.
   * @param {string} id the unique user identifier.
   */
  async update(dto: UpdateUserDto, id: string): Promise<Users> {
    const user = await this.convertToEntity(dto, id);
    const result = await this.usersRepository.update(user.id, user);
    if (result.affected !== 1) {
      const error = new Error();
      error.message = 'Attempted to update a non existing user!';
      error.name = 'repository-error';
      throw error;
    }
    return await this.find(id);
  }

  /**
   * Delete user data entry by id.
   * @param {string} id the unique user identifier.
   */
  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  /**
   * Convert user data transfer object for update into a user entity.
   * @param {string=} id the unique user identifier.
   * @param {UpdateUserDto | CreateUserDto} dto is the user data transfer object
   * @returns {Users} the updated user entity.
   */
  private async convertToEntity(
    dto: UpdateUserDto | CreateUserDto,
    id?: string,
  ): Promise<Users> {
    const entity = new Users();
    entity.id = id;

    if (dto.name) {
      entity.name = dto.name;
    }

    if (dto.email) {
      entity.email = dto.email;
    }

    if (dto.password) {
      entity.password = await bcrypt.hash(dto.password, await bcrypt.genSalt());
    }

    return entity;
  }
}
