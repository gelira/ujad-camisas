import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthDTO } from 'src/dto/auth.dto';
import { AuthService } from 'src/services/auth.service';
import { GoogleService } from 'src/services/google.service';
import { ResponsavelService } from 'src/services/responsavel.service';

@Controller('auth')
export class AuthController {
  constructor(
    private googleService: GoogleService,
    private responsavelService: ResponsavelService,
    private authService: AuthService
  ) {}

  @Post('google')
  async authGoogle(@Body() authDTO: AuthDTO) {
    let email = '';
    let name = '';

    try {
      const validation = await this.googleService.validateToken(authDTO.token);

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

    const token = await this.authService.generateToken(responsavel.id);

    return { token };
  }
}
