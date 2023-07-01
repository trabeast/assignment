import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database';
import { Users } from './entities/users.entity';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { NameConstraint } from './custom-validation/name-constraint';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync(databaseConfig),
    TypeOrmModule.forFeature([Users]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, NameConstraint],
})
export class UserModule {}
