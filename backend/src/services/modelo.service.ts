import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Modelo } from 'src/schemas/modelo.schema';

@Injectable()
export class ModeloService {
  constructor(@InjectModel(Modelo.name) private modeloModel: Model<Modelo>) {}

  async findAll() {
    return this.modeloModel.find({});
  }
}
