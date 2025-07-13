import { IsEnum, IsNumber } from 'class-validator';

export enum TipoParticipacao {
  ORGANIZADOR = 'organizador',
  PALESTRANTE = 'palestrante',
  MEDIADOR = 'mediador',
  MONITOR = 'monitor',
  OUVINTE = 'ouvinte',
}

export class CreateParticipacaoDto {
  @IsEnum(TipoParticipacao)
  tipo: string;

  @IsNumber()
  fk_idParticipante: number;

  @IsNumber()
  fk_idAtividade: number;
}
