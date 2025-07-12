import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CreateDTO } from './dto/participante';
import { ParticipanteService } from './participante.service';

@Controller('participante')
export class ParticipanteController {
    constructor(private participanteService: ParticipanteService){}
    
    @Post('create')
    async create(@Body() participante: CreateDTO) {
        return participante;
    }

    @Get('get')
    async get() {}

    @Put('update')
    async update() {}

    @Delete('delete')
    async delete() {}
}
