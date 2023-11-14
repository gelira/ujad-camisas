import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { CreateCamisaDTO } from 'src/dto/camisa.dto';

import { AuthGuard } from 'src/guards/auth.guard';
import { UserDocument } from 'src/schemas/user.schema';
import { CamisaService } from 'src/services/camisa.service';
import { ModeloService } from 'src/services/modelo.service';
import { SetorService } from 'src/services/setor.service';
import { TamanhoService } from 'src/services/tamanho.service';

@Controller('camisa')
export class CamisaController {
  constructor(
    private camisaService: CamisaService,
    private setorService: SetorService,
    private modeloService: ModeloService,
    private tamanhoService: TamanhoService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createCamisa(
    @RequestUser() user: UserDocument,
    @Body() createCamisaDTO: CreateCamisaDTO,
  ) {
    await this.setorService.findById(
      createCamisaDTO.setorId,
      !user.admin && user.id,
    );

    const modelo = await this.modeloService.findById(createCamisaDTO.modeloId);
    const tamanho = await this.tamanhoService.findById(
      createCamisaDTO.tamanhoId,
    );

    await this.camisaService.create(createCamisaDTO, modelo, tamanho);
  }

  @UseGuards(AuthGuard)
  @Get('list')
  async listCamisas(
    @RequestUser() user: UserDocument,
    @Query('setorId') setorId: string,
  ) {
    await this.setorService.findById(setorId, !user.admin && user.id);

    const camisas = (await this.camisaService.findBySetor(setorId)).map(
      ({
        id,
        nomePessoa,
        modeloId,
        modeloDescricao,
        modeloValor,
        totalPago,
        tamanhoId,
        tamanhoDescricao,
      }) => ({
        id,
        nomePessoa,
        modeloId,
        modeloDescricao,
        modeloValor,
        totalPago,
        tamanhoId,
        tamanhoDescricao,
      }),
    );

    return { camisas };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCamisaa(
    @RequestUser() user: UserDocument,
    @Param('id') id: string,
  ) {
    const camisa = await this.camisaService.findById(id);

    if (!user.admin) {
      await this.setorService.findById(camisa.setorId, user.id);
    }

    await this.camisaService.softDelete(camisa);
  }
}
