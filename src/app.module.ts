import { Module } from '@nestjs/common';
import { EventoModule } from './evento/evento.module';
import { AtividadeModule } from './atividade/atividade.module';
import { ParticipanteModule } from './participante/participante.module';
import { ParticipacaoModule } from './participacao/participacao.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    EventoModule,
    AtividadeModule,
    ParticipanteModule,
    ParticipacaoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
