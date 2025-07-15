import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AtividadeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAtividadeDto: CreateAtividadeDto) {
    const { titulo, fk_idEvento, dataHoraInicio, dataHoraFim } =
      createAtividadeDto;

    const evento = await this.prisma.evento.findUnique({
      where: { idEvento: fk_idEvento },
    });

    if (!evento) {
      throw new NotFoundException(`Evento com ID ${fk_idEvento} não encontrado.`);
    }

    const atividadeExists = await this.prisma.atividade.findFirst({
      where: { titulo, fk_idEvento },
    });

    if (atividadeExists) {
      throw new ConflictException(
        'Já existe uma atividade com este título neste evento.',
      );
    }

    if (new Date(dataHoraInicio) < new Date(evento.dataHoraInicio)) {
      throw new BadRequestException(
        'A data de início da atividade não pode ser anterior à data de início do evento.',
      );
    }

    if (new Date(dataHoraFim) > new Date(evento.dataHoraFim)) {
      throw new BadRequestException(
        'A data de término da atividade não pode ser posterior à data de término do evento.',
      );
    }

    return this.prisma.atividade.create({ data: createAtividadeDto });
  }

  findAll() {
    return this.prisma.atividade.findMany();
  }

  async findOne(id: number) {
    const atividade = await this.prisma.atividade.findUnique({
      where: { idAtividade: id },
    });
    if (!atividade) {
      throw new NotFoundException(`Atividade com ID ${id} não encontrada.`);
    }
    return atividade;
  }

  async update(id: number, updateAtividadeDto: UpdateAtividadeDto) {
    const atividade = await this.findOne(id); 

    if (updateAtividadeDto.titulo) {
      const atividadeExists = await this.prisma.atividade.findFirst({
        where: {
          titulo: updateAtividadeDto.titulo,
          fk_idEvento: atividade.fk_idEvento,
          idAtividade: { not: id },
        },
      });

      if (atividadeExists) {
        throw new ConflictException(
          'Já existe uma atividade com este título neste evento.',
        );
      }
    }

    const fk_idEvento = updateAtividadeDto.fk_idEvento ?? atividade.fk_idEvento;
    const evento = await this.prisma.evento.findUnique({
      where: { idEvento: fk_idEvento },
    });
    if (!evento) {
      throw new NotFoundException(`Evento com ID ${fk_idEvento} não encontrado.`);
    }

    const dataHoraInicio =
      updateAtividadeDto.dataHoraInicio ?? atividade.dataHoraInicio;
    const dataHoraFim = updateAtividadeDto.dataHoraFim ?? atividade.dataHoraFim;

    if (new Date(dataHoraInicio) < new Date(evento.dataHoraInicio)) {
      throw new BadRequestException(
        'A data de início da atividade não pode ser anterior à data de início do evento.',
      );
    }

    if (new Date(dataHoraFim) > new Date(evento.dataHoraFim)) {
      throw new BadRequestException(
        'A data de término da atividade não pode ser posterior à data de término do evento.',
      );
    }

    return this.prisma.atividade.update({
      where: { idAtividade: id },
      data: updateAtividadeDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.atividade.delete({ where: { idAtividade: id } });
  }

  async findPessoasByAtividade(idAtividade: number) {
    await this.findOne(idAtividade);

    const participacoes = await this.prisma.participacao.findMany({
      where: {
        fk_idAtividade: idAtividade,
      },
      include: {
        participante: true,
      },
    });

    const roleOrder = [
      'organizador',
      'palestrante',
      'mediador',
      'monitor',
      'ouvinte',
    ];

    participacoes.sort((a, b) => {
      return roleOrder.indexOf(a.tipo) - roleOrder.indexOf(b.tipo);
    });

    return participacoes.map((p) => ({
      nome: p.participante.nome,
      email: p.participante.email,
      funcao: p.tipo,
    }));
  }
}
