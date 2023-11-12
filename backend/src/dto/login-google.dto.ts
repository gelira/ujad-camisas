import { IsNotEmpty, IsString } from 'class-validator';

export class LoginGoogleDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}
