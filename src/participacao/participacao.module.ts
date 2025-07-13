import { Module } from '@nestjs/common';
import { ParticipacaoService } from './participacao.service';
import { ParticipacaoController } from './participacao.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParticipacaoController],
  providers: [ParticipacaoService],
})
export class ParticipacaoModule {}
