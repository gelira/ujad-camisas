import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { GoogleService } from './services/google.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '4h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [GoogleService, UserService, AuthService],
})
export class AppModule {}
