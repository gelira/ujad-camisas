import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { LoginController } from './controllers/login.controller';
import { GoogleService } from './services/google.service';
import { Responsavel, ResponsavelSchema } from './schemas/responsavel.schema';
import { ResponsavelService } from './services/responsavel.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost/ujad-camisas'),
    MongooseModule.forFeature([
      { name: Responsavel.name, schema: ResponsavelSchema },
    ]),
  ],
  controllers: [LoginController],
  providers: [GoogleService, ResponsavelService],
})
export class AppModule {}
