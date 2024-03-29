import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Camisa, CamisaDocument } from 'src/schemas/camisa.schema';
import { CreateCamisaDTO, UpdateCamisaDTO } from 'src/dto/camisa.dto';
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

  async update(
    camisa: CamisaDocument,
    updateCamisaDTO: UpdateCamisaDTO,
    modelo: Modelo,
    tamanho: Tamanho,
  ) {
    camisa.nomePessoa = updateCamisaDTO.nomePessoa;
    camisa.modeloId = updateCamisaDTO.modeloId;
    camisa.modeloDescricao = modelo.descricao;
    camisa.modeloValor = modelo.valor;
    camisa.totalPago = updateCamisaDTO.totalPago;
    camisa.tamanhoId = updateCamisaDTO.tamanhoId;
    camisa.tamanhoDescricao = tamanho.descricao;

    await camisa.save();
  }

  async findById(id: string) {
    const camisa = await this.camisaModel.findById(id);

    if (!camisa || camisa.deletedAt) {
      throw new NotFoundException();
    }

    return camisa;
  }

  async softDelete(camisa: CamisaDocument) {
    camisa.deletedAt = new Date();
    await camisa.save();
  }

  async findBySetorRemessa(setorId: string, remessaId: string) {
    return this.camisaModel
      .find({ setorId, remessaId, deletedAt: null })
      .sort({ nomePessoa: 1, createdAt: 1 });
  }

  async findBySetor(setorId: string) {
    return this.camisaModel
      .find({ setorId, deletedAt: null })
      .sort({ nomePessoa: 1, createdAt: 1 });
  }

  async countByModeloTamanho({
    modeloId,
    tamanhoId,
    setorId,
    remessaId,
  }: {
    modeloId: string,
    tamanhoId: string,
    setorId?: string,
    remessaId?: string,
  }) {
    return this.camisaModel.countDocuments({
      ...(setorId && { setorId }),
      ...(remessaId && { remessaId }),
      modeloId,
      tamanhoId,
      deletedAt: null,
    });
  }

  async countBySetor(setorId: string) {
    return this.camisaModel.countDocuments({
      setorId,
      deletedAt: null,
    });
  }
}
