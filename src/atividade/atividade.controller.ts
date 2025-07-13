import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AtividadeService } from './atividade.service';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';

@Controller('atividade')
export class AtividadeController {
  constructor(private readonly atividadeService: AtividadeService) {}

  @Post()
  create(@Body() createAtividadeDto: CreateAtividadeDto) {
    return this.atividadeService.create(createAtividadeDto);
  }

  @Get()
  findAll() {
    return this.atividadeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atividadeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAtividadeDto: UpdateAtividadeDto) {
    return this.atividadeService.update(+id, updateAtividadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atividadeService.remove(+id);
  }
}
