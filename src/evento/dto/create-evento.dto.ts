import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export enum TipoEvento {
  GRATUITO = 'gratuito',
  PAGO = 'pago',
}

export class CreateEventoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  edicao: string;

  @IsEnum(TipoEvento)
  tipo: string;

  @IsDateString()
  dataHoraInicio: Date;

  @IsDateString()
  dataHoraFim: Date;

  @IsOptional()
  @ValidateIf((o) => o.tipo === TipoEvento.PAGO)
  @IsNumber()
  @IsPositive()
  taxa?: number;
}
