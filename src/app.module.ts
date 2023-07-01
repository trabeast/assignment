import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.development.env'],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
