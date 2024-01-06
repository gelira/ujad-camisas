import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import { generatePdf } from 'html-pdf-node-ts';
import { ModeloDocument } from 'src/schemas/modelo.schema';
import { TamanhoDocument } from 'src/schemas/tamanho.schema';
import { RemessaDocument } from 'src/schemas/remessa.schema';

import { SetorService } from './setor.service';
import { ModeloService } from './modelo.service';
import { CamisaService } from './camisa.service';
import { TamanhoService } from './tamanho.service';
import { RemessaService } from './remessa.service';

@Injectable()
export class ReportService {
  constructor(
    private setorService: SetorService,
    private modeloService: ModeloService,
    private tamanhoService: TamanhoService,
    private camisaService: CamisaService,
    private remessaService: RemessaService,
  ) {}

  async generateReportCamisasRemessa(remessaId: string) {
    const remessa = await this.remessaService.findById(remessaId);

    if (!remessa) {
      throw new NotFoundException('Remessa não encontrada');
    }

    const pedidos = await this.countCamisasRemessa(remessa);

    const file = readFileSync(
      join(process.cwd(), 'src', 'templates', 'report.handlebars'),
      { encoding: 'utf8' },
    );

    const template = Handlebars.compile(file);

    const content = template({
      pedidos,
      remessaDescricao: remessa.descricao,
      remessaInicio: remessa.inicio.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' }),
      remessaFinal: remessa.final.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' }),
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

  private async countCamisasRemessa(remessa: RemessaDocument) {
    const [setores, modelos, tamanhos] = await Promise.all([
      this.setorService.findAll(),
      this.modeloService.findAll(),
      this.tamanhoService.findAll(),
    ]);

    const data = await Promise.all([
      this.countCamisasByRemessaModelosSetor(remessa, modelos, tamanhos, 'Geral'),
      ...setores.map(
        ({ id, nome }) => 
          this.countCamisasByRemessaModelosSetor(remessa, modelos, tamanhos, nome, id)
      ),
    ]);

    return data;
  }

  private async countCamisasByRemessaModelosSetor(
    remessa: RemessaDocument,
    modelos: ModeloDocument[],
    tamanhos: TamanhoDocument[],
    setorNome: string,
    setorId?: string
  ) {
    const quantidadesModelos = await Promise.all(modelos.map(async (modelo) => {
      const quantidade = await this.countCamisasByRemessaTamanhosModelo(
        remessa,
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

  private async countCamisasByRemessaTamanhosModelo(
    remessa: RemessaDocument,
    modelo: ModeloDocument,
    tamanhos: TamanhoDocument[],
    setorId?: string,
  ) {
    const quantidadesTamanhos = await Promise.all(tamanhos.map(async (tamanho) => {
      const quantidade = await this.camisaService.countByRemessaModeloTamanho(
        remessa.id,
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
