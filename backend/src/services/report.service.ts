import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import { generatePdf } from 'html-pdf-node-ts';
import { ModeloDocument } from 'src/schemas/modelo.schema';
import { TamanhoDocument } from 'src/schemas/tamanho.schema';

import { SetorService } from './setor.service';
import { ModeloService } from './modelo.service';
import { CamisaService } from './camisa.service';
import { TamanhoService } from './tamanho.service';

@Injectable()
export class ReportService {
  constructor(
    private setorService: SetorService,
    private modeloService: ModeloService,
    private tamanhoService: TamanhoService,
    private camisaService: CamisaService,
  ) {}

  async generateReportAllCamisas() {
    const pedidos = await this.countCamisas();

    const file = readFileSync(
      join(process.cwd(), 'src', 'templates', 'report.handlebars'),
      { encoding: 'utf8' },
    );

    const template = Handlebars.compile(file);

    const content = template({
      pedidos,
      timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
    });

    const buffer = await generatePdf(
      { content },
      {
        format: 'A4',
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
      },
    );

    return `data:application/pdf;base64,${buffer.toString('base64')}`;
  }

  private async countCamisas() {
    const [setores, modelos, tamanhos] = await Promise.all([
      this.setorService.findAll(),
      this.modeloService.findAll(),
      this.tamanhoService.findAll(),
    ]);

    const data = await Promise.all([
      this.countCamisasByModelosSetor(modelos, tamanhos, 'Geral'),
      ...setores.map(({ id, nome }) => this.countCamisasByModelosSetor(modelos, tamanhos, nome, id)),
    ]);

    return data;
  }

  private async countCamisasByModelosSetor(
    modelos: ModeloDocument[],
    tamanhos: TamanhoDocument[],
    setorNome: string,
    setorId?: string
  ) {
    const quantidadesModelos = await Promise.all(modelos.map(async (modelo) => {
      const quantidade = await this.countCamisasByTamanhosModelo(
        modelo,
        tamanhos,
        setorId,
      );

      return quantidade;
    }));

    return {
      setor: setorNome,
      quantidadeSetor: quantidadesModelos.reduce((acc, curr) => acc + curr.quantidadeModelo, 0),
      quantidadesModelos,
    };
  }

  private async countCamisasByTamanhosModelo(
    modelo: ModeloDocument,
    tamanhos: TamanhoDocument[],
    setorId?: string,
  ) {
    const quantidadesTamanhos = await Promise.all(tamanhos.map(async (tamanho) => {
      const quantidade = await this.camisaService.countByModeloTamanho(
        modelo.id,
        tamanho.id,
        setorId,
      );

      return { tamanho: tamanho.descricao, quantidade };
    }));

    return {
      modelo: modelo.descricao,
      quantidadeModelo: quantidadesTamanhos.reduce((acc, curr) => acc + curr.quantidade, 0),
      quantidadesTamanhos,
    };
  }
}
