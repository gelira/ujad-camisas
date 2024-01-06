import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';

import { ReportService } from 'src/services/report.service';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @UseGuards(AdminGuard)
  @Get('remessa/:remessaId')
  async remessaCamisasReport(@Param('remessaId') remessaId: string) {
    const report = await this.reportService.generateReportCamisasRemessa(remessaId);

    return { report };
  }
}
