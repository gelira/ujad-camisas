import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Setor } from 'src/schemas/setor.schema';

@Injectable()
export class SetorService {
  constructor(@InjectModel(Setor.name) private setorModel: Model<Setor>) {}

  async findAll() {
    return this.setorModel.find({});
  }

  async findByResponsavel(id: any) {
    return this.setorModel.find({ responsaveis: id });
  }
}
