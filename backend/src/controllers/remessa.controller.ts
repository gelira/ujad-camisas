import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';
import { RemessaService } from 'src/services/remessa.service';

@Controller('remessa')
export class RemessaController {
  constructor(private remessaService: RemessaService) {}

  @UseGuards(AuthGuard)
  @Get('list')
  async listRemessas() {
    const remessas = (await this.remessaService.findAll()).map(
      ({ id, descricao }) => ({ id, descricao }),
    );

    return { remessas };
  }

  @UseGuards(AuthGuard)
  @Get('aberta')
  async remessaAberta() {
    const {
      id,
      descricao,
      abertoManual,
      inicio,
      final,
    } = await this.remessaService.findAberta();

    return {
      remessa: {
        id,
        descricao,
        abertoManual,
        inicio,
        final,
      }, 
    };
  }
}
