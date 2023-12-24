import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCamisaDTO {
  @IsString()
  @IsNotEmpty()
  setorId: string;

  @IsString()
  @IsNotEmpty()
  remessaId: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  nomePessoa: string;

  @IsString()
  @IsNotEmpty()
  modeloId: string;

  @IsNumber()
  @Min(0)
  totalPago: number;

  @IsString()
  @IsNotEmpty()
  tamanhoId: string;
}

export class UpdateCamisaDTO {
  @IsString()
  @Transform(({ value }) => value?.trim())
  nomePessoa: string;

  @IsString()
  @IsNotEmpty()
  modeloId: string;

  @IsNumber()
  @Min(0)
  totalPago: number;

  @IsString()
  @IsNotEmpty()
  tamanhoId: string;
}
