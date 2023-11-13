import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';
import { TamanhoService } from 'src/services/tamanho.service';

@Controller('tamanho')
export class TamanhoController {
  constructor(private tamanhoService: TamanhoService) {}

  @UseGuards(AuthGuard)
  @Get('list')
  async listTamanhoes() {
    const tamanhos = (await this.tamanhoService.findAll()).map(
      ({ id, descricao }) => ({ id, descricao }),
    );

    return { tamanhos };
  }
}
