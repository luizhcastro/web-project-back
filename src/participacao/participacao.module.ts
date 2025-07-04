import { Module } from '@nestjs/common';
import { ParticipacaoController } from './participacao.controller';
import { ParticipacaoService } from './participacao.service';

@Module({
        controllers: [ParticipacaoController],
        providers: [ParticipacaoService]
})
export class ParticipacaoModule {}
