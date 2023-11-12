import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { LoginGoogleDTO } from 'src/dto/login-google.dto';

@Controller('login')
export class LoginController {
  constructor(private configService: ConfigService) {}

  @Post('google')
  async loginWithGoogleToken(@Body() loginGoogleDTO: LoginGoogleDTO) {
    const CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken: loginGoogleDTO.token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return payload;
  }
}
