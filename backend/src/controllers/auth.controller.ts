import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RequestUser } from 'src/decorators/request-user.decorator';

import { AuthDTO } from 'src/dto/auth.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/schemas/user.schema';
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

  @UseGuards(AuthGuard)
  @Get('user-info')
  info(@RequestUser() user: User) {
    const { nome, email, admin } = user;

    return { nome, email, admin };
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async authGoogle(@Body() authDTO: AuthDTO) {
    const { email, name } = await this.googleService.validateToken(
      authDTO.token,
    );

    const user = await this.userService.findByEmail(email);

    if (!user.nome) {
      user.nome = name;

      await user.save();
    }

    const token = await this.authService.generateToken(user.id);

    return { token };
  }
}
