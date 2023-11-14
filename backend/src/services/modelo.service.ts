import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Modelo } from 'src/schemas/modelo.schema';

@Injectable()
export class ModeloService {
  constructor(@InjectModel(Modelo.name) private modeloModel: Model<Modelo>) {}

  async findAll() {
    return this.modeloModel.find({}).sort({ descricao: 1, createdAt: 1 });
  }

  async findById(id: any) {
    const modelo = await this.modeloModel.findById(id);

    if (!modelo) {
      throw new NotFoundException('Modelo not found');
    }

    return modelo;
  }
}
