import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';

import { ReportService } from 'src/services/report.service';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @UseGuards(AdminGuard)
  @Get('pedidos-camisas')
  async pedidosCamisasReport(@Query('remessaId') remessaId?: string) {
    const report = await this.reportService.generateReportPedidosCamisas(remessaId);

    return { report };
  }
}
