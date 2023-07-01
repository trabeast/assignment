import { EntitySchema } from 'typeorm';
import { Users } from '../entities/users.entity';

export const UsersSchema = new EntitySchema<Users>({
  name: 'Users',
  target: Users,
  columns: {
    id: {
      type: 'varchar',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 255,
      nullable: false,
      unique: true,
    },
    password: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    createdAt: {
      type: 'date',
    },
    updateAt: {
      type: 'date',
    },
  },
});
