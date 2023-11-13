import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginGoogleDTO } from 'src/dto/login-google.dto';
import { GoogleService } from 'src/services/google.service';
import { ResponsavelService } from 'src/services/responsavel.service';

@Controller('login')
export class LoginController {
  constructor(
    private googleService: GoogleService,
    private responsavelService: ResponsavelService,
  ) {}

  @Post('google')
  async loginWithGoogleToken(@Body() loginGoogleDTO: LoginGoogleDTO) {
    let email = '';
    let name = '';

    try {
      const validation = await this.googleService.validateToken(
        loginGoogleDTO.token,
      );

      email = validation.email;
      name = validation.name;
    } catch {
      throw new BadRequestException('Invalid token');
    }

    const responsavel = await this.responsavelService.findByEmail(email);

    if (!responsavel) {
      throw new UnauthorizedException('User not registered');
    }

    if (!responsavel.nome) {
      responsavel.nome = name;

      await responsavel.save();
    }

    return responsavel;
  }
}
