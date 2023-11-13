import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tamanho } from 'src/schemas/tamanho.schema';

@Injectable()
export class TamanhoService {
  constructor(
    @InjectModel(Tamanho.name) private tamanhoModel: Model<Tamanho>,
  ) {}

  async findAll() {
    return this.tamanhoModel.find({});
  }

  async findById(id: any) {
    const tamanho = await this.tamanhoModel.findById(id);

    if (!tamanho) {
      throw new NotFoundException('Tamanho not found');
    }

    return tamanho;
  }
}
