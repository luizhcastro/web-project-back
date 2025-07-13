import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ParticipanteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createParticipanteDto: CreateParticipanteDto) {
    const { cpf, email } = createParticipanteDto;

    const participanteExists = await this.prisma.participante.findFirst({
      where: { OR: [{ cpf }, { email }] },
    });

    if (participanteExists) {
      throw new ConflictException(
        'Já existe um participante com este CPF ou e-mail.',
      );
    }

    return this.prisma.participante.create({ data: createParticipanteDto });
  }

  findAll() {
    return this.prisma.participante.findMany();
  }

  async findOne(id: number) {
    const participante = await this.prisma.participante.findUnique({
      where: { idParticipante: id },
    });
    if (!participante) {
      throw new NotFoundException(`Participante com ID ${id} não encontrado.`);
    }
    return participante;
  }

  async update(id: number, updateParticipanteDto: UpdateParticipanteDto) {
    await this.findOne(id);

    const { cpf, email } = updateParticipanteDto;
    if (cpf || email) {
      const whereClause: any[] = [];
      if (cpf) whereClause.push({ cpf });
      if (email) whereClause.push({ email });

      const participanteExists = await this.prisma.participante.findFirst({
        where: {
          OR: whereClause,
          idParticipante: { not: id },
        },
      });

      if (participanteExists) {
        throw new ConflictException(
          'Já existe um participante com este CPF ou e-mail.',
        );
      }
    }

    return this.prisma.participante.update({
      where: { idParticipante: id },
      data: updateParticipanteDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.participante.delete({ where: { idParticipante: id } });
  }

  async findAllByBirthYear(year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    return this.prisma.participante.findMany({
      where: {
        dataDeNascimento: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}
