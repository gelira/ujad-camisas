import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';
import { ModeloService } from 'src/services/modelo.service';

@Controller('modelo')
export class ModeloController {
  constructor(private modeloService: ModeloService) {}

  @UseGuards(AuthGuard)
  @Get('list')
  async listSetores() {
    const modelos = (await this.modeloService.findAll()).map(
      ({ id, descricao, valor }) => ({
        id,
        descricao,
        valor,
      }),
    );

    return { modelos };
  }
}
