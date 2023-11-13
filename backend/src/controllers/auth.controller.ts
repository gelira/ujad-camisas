import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthDTO } from 'src/dto/auth.dto';
import { AuthService } from 'src/services/auth.service';
import { GoogleService } from 'src/services/google.service';
import { UserService } from 'src/services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private googleService: GoogleService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('google')
  @HttpCode(HttpStatus.OK)
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

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not registered');
    }

    if (!user.nome) {
      user.nome = name;

      await user.save();
    }

    const token = await this.authService.generateToken(user.id);

    return { token };
  }
}
