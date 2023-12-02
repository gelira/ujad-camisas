import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import { generatePdf } from 'html-pdf-node-ts';

@Injectable()
export class ReportService {
  async generateReport() {
    const file = readFileSync(
      join(process.cwd(), 'src', 'templates', 'report.html'),
      { encoding: 'utf8' },
    );

    const data = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Fortaleza',
    });

    const template = Handlebars.compile(file);

    const content = template({ data });

    const buffer = await generatePdf(
      { content },
      {
        format: 'A4',
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
      },
    );

    return `data:application/pdf;base64,${buffer.toString('base64')}`;
  }
}
