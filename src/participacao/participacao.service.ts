import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateParticipacaoDto, TipoParticipacao } from './dto/create-participacao.dto';
import { UpdateParticipacaoDto } from './dto/update-participacao.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParticipacaoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createParticipacaoDto: CreateParticipacaoDto) {
    const { fk_idAtividade, fk_idParticipante, tipo } = createParticipacaoDto;

    await this.checkAtividadeAndParticipante(fk_idAtividade, fk_idParticipante);

    if (tipo === TipoParticipacao.OUVINTE) {
      await this.checkOuvinteCapacity(fk_idAtividade);
    }

    try {
      return await this.prisma.participacao.create({
        data: createParticipacaoDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Este participante já está cadastrado nesta atividade.',
        );
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.participacao.findMany({
      include: { participante: true, atividade: true },
    });
  }

  async findOne(id: number) {
    const participacao = await this.prisma.participacao.findUnique({
      where: { idParticipacao: id },
      include: { participante: true, atividade: true },
    });
    if (!participacao) {
      throw new NotFoundException(`Participação com ID ${id} não encontrada.`);
    }
    return participacao;
  }

  async update(id: number, updateParticipacaoDto: UpdateParticipacaoDto) {
    const participacao = await this.findOne(id);

    const fk_idAtividade =
      updateParticipacaoDto.fk_idAtividade ?? participacao.fk_idAtividade;

    if (
      updateParticipacaoDto.tipo === TipoParticipacao.OUVINTE &&
      participacao.tipo !== TipoParticipacao.OUVINTE
    ) {
      await this.checkOuvinteCapacity(fk_idAtividade);
    }

    try {
      return await this.prisma.participacao.update({
        where: { idParticipacao: id },
        data: updateParticipacaoDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Este participante já está cadastrado nesta atividade.',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.participacao.delete({ where: { idParticipacao: id } });
  }

  private async checkAtividadeAndParticipante(
    idAtividade: number,
    idParticipante: number,
  ) {
    const atividade = await this.prisma.atividade.findUnique({
      where: { idAtividade },
    });
    if (!atividade) {
      throw new NotFoundException(`Atividade com ID ${idAtividade} não encontrada.`);
    }

    const participante = await this.prisma.participante.findUnique({
      where: { idParticipante },
    });
    if (!participante) {
      throw new NotFoundException(
        `Participante com ID ${idParticipante} não encontrado.`,
      );
    }
  }

  private async checkOuvinteCapacity(idAtividade: number) {
    const atividade = await this.prisma.atividade.findUnique({
      where: { idAtividade },
    });

    if (!atividade) {
      throw new NotFoundException(`Atividade com ID ${idAtividade} não encontrada.`);
    }

    const ouvintesCount = await this.prisma.participacao.count({
      where: {
        fk_idAtividade: idAtividade,
        tipo: TipoParticipacao.OUVINTE,
      },
    });

    if (ouvintesCount >= atividade.qntdMaximaOuvintes) {
      throw new BadRequestException(
        'A quantidade máxima de ouvintes para esta atividade já foi atingida.',
      );
    }
  }
}
