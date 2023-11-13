import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: any) {
    return this.throwIfDoesNotExist(await this.userModel.findById(id));
  }

  async findByEmail(email: string) {
    return this.throwIfDoesNotExist(await this.userModel.findOne({ email }));
  }

  private async throwIfDoesNotExist(user: UserDocument) {
    if (!user) {
      throw new UnauthorizedException('User not registered');
    }

    return user;
  }
}
