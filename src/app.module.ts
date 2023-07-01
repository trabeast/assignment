import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './database';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './authentication';
import { AuthController } from './controllers/auth.controller';
import { Users } from './entities/users.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(databaseConfig),
    TypeOrmModule.forFeature([Users]),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService],
})
export class AppModule {}
