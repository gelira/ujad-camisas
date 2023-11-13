import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Camisa } from 'src/schemas/camisa.schema';
import { CreateCamisaDTO } from 'src/dto/camisa.dto';
import { Modelo } from 'src/schemas/modelo.schema';
import { Tamanho } from 'src/schemas/tamanho.schema';

@Injectable()
export class CamisaService {
  constructor(@InjectModel(Camisa.name) private camisaModel: Model<Camisa>) {}

  async create(
    createCamisaDTO: CreateCamisaDTO,
    modelo: Modelo,
    tamanho: Tamanho,
  ) {
    const camisa = new this.camisaModel({
      ...createCamisaDTO,
      modeloDescricao: modelo.descricao,
      modeloValor: modelo.valor,
      tamanhoDescricao: tamanho.descricao,
    });

    return camisa.save();
  }

  async findBySetor(setorId: string) {
    return this.camisaModel.find({ setorId });
  }
}
