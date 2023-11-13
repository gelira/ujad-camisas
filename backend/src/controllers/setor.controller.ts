import { Controller, Get, UseGuards } from '@nestjs/common';
import { RequestUser } from 'src/decorators/request-user.decorator';

import { AuthGuard } from 'src/guards/auth.guard';
import { UserDocument } from 'src/schemas/user.schema';
import { SetorService } from 'src/services/setor.service';

@Controller('setor')
export class SetorController {
  constructor(private setorService: SetorService) {}

  @UseGuards(AuthGuard)
  @Get('list')
  async listSetores(@RequestUser() user: UserDocument) {
    const listSetores = user.admin
      ? await this.setorService.findAll()
      : await this.setorService.findByResponsavel(user.id);

    const setores = listSetores.map(({ id, nome }) => ({ id, nome }));

    return { setores };
  }
}
