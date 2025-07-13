import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export enum TipoAtividade {
  PALESTRA = 'palestra',
  MINICURSO = 'minicurso',
  MESA_REDONDA = 'mesa redonda',
}

export class CreateAtividadeDto {
  @IsEnum(TipoAtividade)
  tipo: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsDateString()
  dataHoraInicio: Date;

  @IsDateString()
  dataHoraFim: Date;

  @IsNumber()
  @IsPositive()
  qntdMaximaOuvintes: number;

  @IsNumber()
  fk_idEvento: number;
}
