import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
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
    const { nome, email, admin, picture } = user;

    return { nome, email, admin, picture };
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async authGoogle(@Body() authDTO: AuthDTO) {
    let email: string;
    let name: string;
    let picture: string;

    try {
      const validatedData = await this.googleService.validateCredential(
        authDTO.credential,
      );

      email = validatedData.email;
      name = validatedData.name;
      picture = validatedData.picture;
    } catch {
      throw new UnauthorizedException('Invalid credential');
    }

    const user = await this.userService.findByEmail(email);

    if (!user || !user.active) {
      throw new UnauthorizedException('User not found');
    }

    let toUpdate = false;

    if (user.nome !== name) {
      user.nome = name;
      toUpdate = true;
    }

    if (user.picture !== picture) {
      user.picture = picture;
      toUpdate = true;
    }

    if (toUpdate) {
      await user.save();
    }

    const token = await this.authService.generateToken(user.id);

    return { token };
  }
}
