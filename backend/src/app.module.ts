import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { GoogleService } from './services/google.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { Setor, SetorSchema } from './schemas/setor.schema';
import { SetorService } from './services/setor.service';
import { SetorController } from './controllers/setor.controller';
import { Modelo, ModeloSchema } from './schemas/modelo.schema';
import { ModeloService } from './services/modelo.service';
import { ModeloController } from './controllers/modelo.controller';

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
      { name: User.name, schema: UserSchema },
      { name: Setor.name, schema: SetorSchema },
      { name: Modelo.name, schema: ModeloSchema },
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
  controllers: [AuthController, SetorController, ModeloController],
  providers: [
    GoogleService,
    UserService,
    AuthService,
    SetorService,
    ModeloService,
  ],
})
export class AppModule {}
