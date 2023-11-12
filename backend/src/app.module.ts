import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { LoginController } from './controllers/login.controller';
import { GoogleService } from './services/google.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost/ujad-camisas'),
  ],
  controllers: [LoginController],
  providers: [GoogleService],
})
export class AppModule {}
