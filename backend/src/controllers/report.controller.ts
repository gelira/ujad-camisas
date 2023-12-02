import { Controller, Get } from '@nestjs/common';

import { ReportService } from 'src/services/report.service';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('teste')
  async info() {
    const report = await this.reportService.generateReport();

    return { report };
  }
}
