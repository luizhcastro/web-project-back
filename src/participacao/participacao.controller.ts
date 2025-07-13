import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParticipacaoService } from './participacao.service';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
import { UpdateParticipacaoDto } from './dto/update-participacao.dto';

@Controller('participacao')
export class ParticipacaoController {
  constructor(private readonly participacaoService: ParticipacaoService) {}

  @Post()
  create(@Body() createParticipacaoDto: CreateParticipacaoDto) {
    return this.participacaoService.create(createParticipacaoDto);
  }

  @Get()
  findAll() {
    return this.participacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParticipacaoDto: UpdateParticipacaoDto) {
    return this.participacaoService.update(+id, updateParticipacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participacaoService.remove(+id);
  }
}
