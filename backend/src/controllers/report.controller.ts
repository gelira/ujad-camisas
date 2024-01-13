import { Controller, Get, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { SetorDocument } from 'src/schemas/setor.schema';
import { UserDocument } from 'src/schemas/user.schema';

import { ReportService } from 'src/services/report.service';
import { SetorService } from 'src/services/setor.service';

@Controller('report')
export class ReportController {
  constructor(
    private reportService: ReportService,
    private setorService: SetorService,
  ) {}

  @UseGuards(AdminGuard)
  @Get('counting-camisas')
  async countingCamisasReport(@Query('remessaId') remessaId?: string) {
    const report = await this.reportService.generateReportPedidosCamisas(remessaId);

    return { report };
  }

  @UseGuards(AuthGuard)
  @Get('listing-camisas')
  async listingCamisasReport(
    @RequestUser() user: UserDocument,
    @Query('setorId') setorId?: string,
  ) {
    let setoresToList: SetorDocument[] = [];

    if (setorId) {
      const setor = await this.setorService.findById(
        setorId,
        !user.admin && user.id,
      );

      setoresToList = [setor];
    } else if (user.admin) {
      setoresToList = await this.setorService.findAll();
    }

    if (!setoresToList.length) {
      throw new NotFoundException('Setor não encontrado');
    }

    const report = await this.reportService.generateReportListaPedidos(setoresToList);

    return { report };
  }
}
