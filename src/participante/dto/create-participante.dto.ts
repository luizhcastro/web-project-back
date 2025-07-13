import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateParticipanteDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;

  @IsEmail()
  email: string;

  @IsDateString()
  dataDeNascimento: Date;
}
