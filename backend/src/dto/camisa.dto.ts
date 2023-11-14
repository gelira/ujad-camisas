import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCamisaDTO {
  @IsString()
  @IsNotEmpty()
  setorId: string;

  @IsString()
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
