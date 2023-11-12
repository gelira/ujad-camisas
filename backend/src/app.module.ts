import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { LoginController } from './controllers/login.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost/ujad-camisas'),
  ],
  controllers: [LoginController],
  providers: [AppService],
})
export class AppModule {}
