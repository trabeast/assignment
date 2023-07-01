import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from './entities/users.entity';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: 'localhost',
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: 'assignment',
    entities: [Users],
    synchronize: true,
  }),
  inject: [ConfigService],
};
