import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './controllers/auth.controller';
import { CamisaController } from './controllers/camisa.controller';
import { ModeloController } from './controllers/modelo.controller';
import { RemessaController } from './controllers/remessa.controller';
import { ReportController } from './controllers/report.controller';
import { SetorController } from './controllers/setor.controller';
import { TamanhoController } from './controllers/tamanho.controller';
import { AuthCode, AuthCodeSchema } from './schemas/auth-code.schema';
import { Camisa, CamisaSchema } from './schemas/camisa.schema';
import { Campo, CampoSchema } from './schemas/campo.schema';
import { Modelo, ModeloSchema } from './schemas/modelo.schema';
import { Remessa, RemessaSchema } from './schemas/remessa.schema';
import { Setor, SetorSchema } from './schemas/setor.schema';
import { Tamanho, TamanhoSchema } from './schemas/tamanho.schema';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from './services/auth.service';
import { CamisaService } from './services/camisa.service';
import { CampoService } from './services/campo.service';
import { GoogleService } from './services/google.service';
import { MailService } from './services/mail.service';
import { ModeloService } from './services/modelo.service';
import { RemessaService } from './services/remessa.service';
import { ReportService } from './services/report.service';
import { SetorService } from './services/setor.service';
import { TamanhoService } from './services/tamanho.service';
import { UserService } from './services/user.service';

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
      { name: Campo.name, schema: CampoSchema },
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
    MailService,
    CampoService
  ],
})
export class AppModule {}
