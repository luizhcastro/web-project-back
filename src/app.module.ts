import { Module } from '@nestjs/common';

import { EventoController } from './evento/evento.controller';
import { EventoService } from './evento/evento.service';
import { ParticipanteController } from './participante/participante.controller';
import { ParticipanteService } from './participante/participante.service';
import { ParticipacaoController } from './participacao/participacao.controller';
import { ParticipacaoService } from './participacao/participacao.service';
import { AtividadeController } from './atividade/atividade.controller';
import { AtividadeService } from './atividade/atividade.service';
import { AtividadeModule } from './atividade/atividade.module';
import { EventoModule } from './evento/evento.module';
import { ParticipacaoModule } from './participacao/participacao.module';
import { ParticipanteModule } from './participante/participante.module';

@Module({
  imports: [AtividadeModule, EventoModule, ParticipacaoModule, ParticipanteModule],
  controllers: [EventoController, ParticipanteController, ParticipacaoController, AtividadeController],
  providers: [EventoService, ParticipanteService, ParticipacaoService, AtividadeService],
})
export class AppModule {}
