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
import { Tamanho, TamanhoSchema } from './schemas/tamanho.schema';
import { TamanhoService } from './services/tamanho.service';
import { TamanhoController } from './controllers/tamanho.controller';
import { CamisaService } from './services/camisa.service';
import { Camisa, CamisaSchema } from './schemas/camisa.schema';
import { CamisaController } from './controllers/camisa.controller';
import { ReportService } from './services/report.service';
import { ReportController } from './controllers/report.controller';
import { Remessa, RemessaSchema } from './schemas/remessa.schema';
import { RemessaService } from './services/remessa.service';
import { RemessaController } from './controllers/remessa.controller';
import { AuthCode, AuthCodeSchema } from './schemas/auth-code.schema';

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
      { name: AuthCode.name, schema: AuthCodeSchema },
      { name: User.name, schema: UserSchema },
      { name: Setor.name, schema: SetorSchema },
      { name: Modelo.name, schema: ModeloSchema },
      { name: Tamanho.name, schema: TamanhoSchema },
      { name: Camisa.name, schema: CamisaSchema },
      { name: Remessa.name, schema: RemessaSchema },
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
  controllers: [
    AuthController,
    SetorController,
    ModeloController,
    TamanhoController,
    CamisaController,
    ReportController,
    RemessaController,
  ],
  providers: [
    GoogleService,
    UserService,
    AuthService,
    SetorService,
    ModeloService,
    TamanhoService,
    CamisaService,
    ReportService,
    RemessaService,
  ],
})
export class AppModule {}
