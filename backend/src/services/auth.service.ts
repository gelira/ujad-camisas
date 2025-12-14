import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthCode } from 'src/schemas/auth-code.schema';

const EXPIRATION_MINUTES = 10;
const CHARSET = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function generateRandomCode() {
  const code = [];

  while (code.length < 6) {
    const randomIndex = Math.floor(Math.random() * CHARSET.length);
    code.push(CHARSET[randomIndex]);
  }

  return code.join('');
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(AuthCode.name) private authCodeModel: Model<AuthCode>
  ) {}

  async generateAuthCode(userId: string) {
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + EXPIRATION_MINUTES);

    const authCode = new this.authCodeModel({
      userId,
      code: generateRandomCode(),
      active: true,
      expiredAt,
    });

    return authCode.save();
  }

  async findValidAuthCode(documentId: string, code: string) {
    return this.authCodeModel.findOne({
      _id: documentId,
      code,
      active: true,
      expiredAt: { $gt: new Date() },
    });
  }

  async generateToken(userId: string) {
    return await this.jwtService.signAsync({ sub: userId });
  }
}
