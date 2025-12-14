import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { generatePdf } from 'html-pdf-node-ts';
import { join } from 'path';
import { ModeloDocument } from 'src/schemas/modelo.schema';
import { RemessaDocument } from 'src/schemas/remessa.schema';
import { SetorDocument } from 'src/schemas/setor.schema';
import { TamanhoDocument } from 'src/schemas/tamanho.schema';

import { CamisaService } from './camisa.service';
import { CampoService } from './campo.service';
import { ModeloService } from './modelo.service';
import { RemessaService } from './remessa.service';
import { SetorService } from './setor.service';
import { TamanhoService } from './tamanho.service';

@Injectable()
export class ReportService {
  constructor(
    private setorService: SetorService,
    private modeloService: ModeloService,
    private tamanhoService: TamanhoService,
    private camisaService: CamisaService,
    private remessaService: RemessaService,
    private campoService: CampoService,
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
    const [campos, modelos, tamanhos] = await Promise.all([
      this.campoService.findAll(),
      this.modeloService.findAll(),
      this.tamanhoService.findAll(),
    ]);

    const data = await Promise.all([
      this.countCamisasByModelosCampo({ modelos, tamanhos, campoNome: 'Geral', remessaId }),
      ...campos.map(
        ({ id, nome }) =>
          this.countCamisasByModelosCampo({ modelos, tamanhos, campoNome: nome, campoId: id, remessaId }),
      ),
    ]);

    return data;
  }

  private async countCamisasByModelosCampo({
    modelos,
    tamanhos,
    campoNome,
    campoId,
    remessaId,
  }: {
    modelos: ModeloDocument[],
    tamanhos: TamanhoDocument[],
    campoNome: string,
    campoId?: string,
    remessaId?: string,
  }) {
    const quantidadesModelos = await Promise.all(modelos.map(async (modelo) => {
      const quantidade = await this.countCamisasByTamanhosModelo({
        modelo,
        tamanhos,
        campoId,
        remessaId,
    });

      return quantidade;
    }));

    return {
      campo: campoNome,
      quantidadeCampo: quantidadesModelos.reduce((acc, curr) => acc + curr.quantidadeModelo, 0),
      quantidadesModelos,
    };
  }

  private async countCamisasByTamanhosModelo({
    modelo,
    tamanhos,
    campoId,
    remessaId,
  }: {
    modelo: ModeloDocument,
    tamanhos: TamanhoDocument[],
    campoId?: string,
    remessaId?: string,
  }) {
    const quantidadesTamanhos = await Promise.all(tamanhos.map(async (tamanho) => {
      let setores: string[] = [];

      if (campoId) {
        setores = (await this.setorService.findByCampo(campoId)).map(({ id }) => id);
      }

      const quantidade = await this.camisaService.countByModeloTamanho({
        modeloId: modelo.id,
        tamanhoId: tamanho.id,
        setores,
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
