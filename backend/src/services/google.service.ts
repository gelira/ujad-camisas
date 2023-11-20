import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleService {
  constructor(private configService: ConfigService) {}

  async validateCredential(credential: string) {
    try {
      const CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
      const client = new OAuth2Client();

      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: CLIENT_ID,
      });

      const { email, name } = ticket.getPayload();

      return { email, name };
    } catch {
      throw new UnauthorizedException('Invalid credential');
    }
  }
}
