import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDTO {
  @IsString()
  @IsNotEmpty()
  credential: string;
}
