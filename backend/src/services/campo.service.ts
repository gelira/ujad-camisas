import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campo } from 'src/schemas/campo.schema';

@Injectable()
export class CampoService {
  constructor(@InjectModel(Campo.name) private campoModel: Model<Campo>) {}

  async findAll() {
    return this.campoModel.find({}).sort({ nome: 1, createdAt: 1 });
  }
}
