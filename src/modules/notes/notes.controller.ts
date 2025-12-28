import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CreateNoteDto } from './dto/create-note.dto';
import { NoteDto } from './dto/note.dto'; // твой DTO ответа
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@ApiTags('Project notes')
@Controller('projects/:projectId/notes')
@ApiParam({ name: 'projectId', type: String, required: true })
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create note in project' })
  @ApiCreatedResponse({ type: NoteDto })
  create(@Param('projectId') projectId: string, @Body() dto: CreateNoteDto) {
    console.log('CREATE PROJECT NOTE');

    return this.notesService.create(projectId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List project notes' })
  @ApiOkResponse({ type: NoteDto, isArray: true })
  findAll(@Param('projectId') projectId: string) {
    return this.notesService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project note by id' })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: NoteDto })
  findOne(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.notesService.findOne(projectId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project note' })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: NoteDto })
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(projectId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project note' })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.notesService.remove(projectId, id);
  }
}
