import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';

import { ReportService } from 'src/services/report.service';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @UseGuards(AdminGuard)
  @Get('all')
  async allCamisas() {
    const report = await this.reportService.generateReportAllCamisas();

    return { report };
  }
}
