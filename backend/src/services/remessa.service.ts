import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Remessa, RemessaDocument } from 'src/schemas/remessa.schema';

@Injectable()
export class RemessaService {
  constructor(@InjectModel(Remessa.name) private remessaModel: Model<Remessa>) {}

  async findAberta() {
    const now = new Date();
    
    const remessa = await this.remessaModel.findOne({
      $or: [
        { abertoManual: true }, 
        { $and: [
          { inicio: { $lte: now } },
          { final: { $gt: now } },
        ] },
      ],
    });

    if (!remessa) {
      throw new NotFoundException;
    }

    return remessa;
  }

  async findAll() {
    return this.remessaModel.find({});
  }

  async findById(id: any) {
    return this.remessaModel.findById(id);
  }

  checkAberta(remessa: RemessaDocument) {
    if (!remessa) {
      return false;
    }

    if (remessa.abertoManual) {
      return true;
    }

    const now = new Date();

    return remessa.inicio <= now && remessa.final > now;
  }
}
