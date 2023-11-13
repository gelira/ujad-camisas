import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { LoginGoogleDTO } from 'src/dto/login-google.dto';
import { GoogleService } from 'src/services/google.service';

@Controller('login')
export class LoginController {
  constructor(private googleService: GoogleService) {}

  @Post('google')
  async loginWithGoogleToken(@Body() loginGoogleDTO: LoginGoogleDTO) {
    try {
      return await this.googleService.validateToken(loginGoogleDTO.token);
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }
}
