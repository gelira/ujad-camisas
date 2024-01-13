import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import { generatePdf } from 'html-pdf-node-ts';
import { ModeloDocument } from 'src/schemas/modelo.schema';
import { TamanhoDocument } from 'src/schemas/tamanho.schema';
import { RemessaDocument } from 'src/schemas/remessa.schema';
import { SetorDocument } from 'src/schemas/setor.schema';

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

  async generateReportPedidosCamisas(remessaId?: string) {
    let remessa: RemessaDocument | undefined;

    if (remessaId) {
      remessa = await this.remessaService.findById(remessaId);

      if (!remessa) {
        throw new NotFoundException('Remessa não encontrada');
      }
    }

    const pedidos = await this.countCamisas(remessaId);

    return await this.buildPDF('counting.handlebars', {
      pedidos,
      timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
      remessaDescricao: remessa?.descricao ?? 'Geral',
      remessaInicio: remessa?.inicio.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' }),
      remessaFinal: remessa?.final.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' }),
    });
  }

  async generateReportListaPedidos(setoresToList: SetorDocument[]) {
    const setores = await Promise.all(setoresToList.map(async (setor) => {
      const quantidadeSetor = await this.camisaService.countBySetor(setor.id)
      
      const pedidos = (await this.camisaService.findBySetor(setor.id))
        .map(({ nomePessoa, modeloDescricao, tamanhoDescricao }) => ({
          nomePessoa: nomePessoa.trim() || '[Sem nome]',
          modeloTamanho: `${modeloDescricao} - ${tamanhoDescricao}`,
        }));

      return {
        setorNome: setor.nome,
        quantidadeSetor,
        pedidos,
      }
    }));

    return await this.buildPDF('listing.handlebars', {
      setores,
      timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
    });
  }

  private async buildPDF(reportTemplate: string, context: any) {
    const file = readFileSync(
      join(process.cwd(), 'src', 'templates', reportTemplate),
      { encoding: 'utf8' },
    );

    const template = Handlebars.compile(file);

    const content = template(context);

    const buffer = await generatePdf(
      { content },
      {
        format: 'A4',
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: '<span style="font-size: 12px; width: 100%; text-align: right; margin: 0 20px"><span class="pageNumber"></span>/<span class="totalPages"></span></span>'
      },
    );

    return `data:application/pdf;base64,${buffer.toString('base64')}`;
  }

  private async countCamisas(remessaId?: string) {
    const [setores, modelos, tamanhos] = await Promise.all([
      this.setorService.findAll(),
      this.modeloService.findAll(),
      this.tamanhoService.findAll(),
    ]);

    const data = await Promise.all([
      this.countCamisasByModelosSetor({ modelos, tamanhos, setorNome: 'Geral', remessaId }),
      ...setores.map(
        ({ id, nome }) => 
          this.countCamisasByModelosSetor({ modelos, tamanhos, setorNome: nome, setorId: id, remessaId }),
      ),
    ]);

    return data;
  }

  private async countCamisasByModelosSetor({
    modelos,
    tamanhos,
    setorNome,
    setorId,
    remessaId,
  }: {
    modelos: ModeloDocument[],
    tamanhos: TamanhoDocument[],
    setorNome: string,
    setorId?: string,
    remessaId?: string,
  }) {
    const quantidadesModelos = await Promise.all(modelos.map(async (modelo) => {
      const quantidade = await this.countCamisasByTamanhosModelo({
        modelo,
        tamanhos,
        setorId,
        remessaId,
    });

      return quantidade;
    }));

    return {
      setor: setorNome,
      quantidadeSetor: quantidadesModelos.reduce((acc, curr) => acc + curr.quantidadeModelo, 0),
      quantidadesModelos,
    };
  }

  private async countCamisasByTamanhosModelo({
    modelo,
    tamanhos,
    setorId,
    remessaId,
  }: {
    modelo: ModeloDocument,
    tamanhos: TamanhoDocument[],
    setorId?: string,
    remessaId?: string,
  }) {
    const quantidadesTamanhos = await Promise.all(tamanhos.map(async (tamanho) => {
      const quantidade = await this.camisaService.countByModeloTamanho({
        modeloId: modelo.id,
        tamanhoId: tamanho.id,
        setorId,
        remessaId,
    });

      return { tamanho: tamanho.descricao, quantidade };
    }));

    return {
      modelo: modelo.descricao,
      quantidadeModelo: quantidadesTamanhos.reduce((acc, curr) => acc + curr.quantidade, 0),
      quantidadesTamanhos,
    };
  }
}
