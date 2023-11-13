import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { GoogleService } from './services/google.service';
import { Responsavel, ResponsavelSchema } from './schemas/responsavel.schema';
import { ResponsavelService } from './services/responsavel.service';
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
    MongooseModule.forFeature([
      { name: Responsavel.name, schema: ResponsavelSchema },
    ]),
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
  providers: [GoogleService, ResponsavelService, AuthService],
})
export class AppModule {}
