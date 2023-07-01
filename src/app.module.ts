import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { UsersSchema } from './schemas/users.schema';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './database';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(databaseConfig),
    TypeOrmModule.forFeature([UsersSchema]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class AppModule {}
