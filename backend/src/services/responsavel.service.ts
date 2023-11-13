import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Responsavel } from 'src/schemas/responsavel.schema';

@Injectable()
export class ResponsavelService {
  constructor(
    @InjectModel(Responsavel.name) private responsavelModel: Model<Responsavel>,
  ) {}

  async findByEmail(email: string) {
    return this.responsavelModel.findOne({ email });
  }
}
