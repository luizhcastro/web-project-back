import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventoDto, TipoEvento } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventoDto: CreateEventoDto) {
    const { titulo, edicao, tipo, dataHoraInicio, dataHoraFim, taxa } =
      createEventoDto;

    const eventoExists = await this.prisma.evento.findFirst({
      where: { titulo, edicao },
    });

    if (eventoExists) {
      throw new ConflictException(
        'Já existe um evento com este título e edição.',
      );
    }

    const data: any = {
      titulo,
      edicao,
      tipo,
      dataHoraInicio,
      dataHoraFim,
    };

    if (tipo === TipoEvento.PAGO) {
      data.taxa = taxa;
    }

    return this.prisma.evento.create({
      data,
    });
  }

  findAll() {
    return this.prisma.evento.findMany();
  }

  async findOne(id: number) {
    const evento = await this.prisma.evento.findUnique({
      where: { idEvento: id },
    });
    if (!evento) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado.`);
    }
    return evento;
  }

  async update(id: number, updateEventoDto: UpdateEventoDto) {
    const evento = await this.findOne(id); 

    if (updateEventoDto.titulo || updateEventoDto.edicao) {
      const newTitulo = updateEventoDto.titulo ?? evento.titulo;
      const newEdicao = updateEventoDto.edicao ?? evento.edicao;

      const existingEvent = await this.prisma.evento.findFirst({
        where: {
          titulo: newTitulo,
          edicao: newEdicao,
          idEvento: { not: id },
        },
      });

      if (existingEvent) {
        throw new ConflictException(
          'Já existe um evento com este título e edição.',
        );
      }
    }

    return this.prisma.evento.update({
      where: { idEvento: id },
      data: updateEventoDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.evento.delete({ where: { idEvento: id } });
  }

  async findReceitaTotal() {
    const eventosPagos = await this.prisma.evento.findMany({
      where: {
        tipo: 'pago',
      },
    });

    const receitaEventos = await Promise.all(
      eventosPagos.map(async (evento) => {
        const ouvintesCount = await this.prisma.participacao.count({
          where: {
            tipo: 'ouvinte',
            atividade: {
              fk_idEvento: evento.idEvento,
            },
          },
        });

        return {
          ...evento,
          receitaTotal: ouvintesCount * (evento.taxa || 0),
        };
      }),
    );

    return receitaEventos;
  }
}
