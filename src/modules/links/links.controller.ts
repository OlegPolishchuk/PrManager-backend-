import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { LinksService } from './links.service';

import { CreateLinkDto } from '@/src/modules/links/dto/create-link.dto';
import { LinkDto } from '@/src/modules/links/dto/links.dto';
import { UpdateLinkDto } from '@/src/modules/links/dto/update-link.dto';

@ApiTags('Links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get link by ID' })
  @ApiParam({ name: 'id', description: 'Link ID', type: String })
  @ApiResponse({ status: 200, description: 'Link found', type: LinkDto })
  @ApiResponse({ status: 404, description: 'Link not found' })
  getLink(@Param('id') id: string) {
    return this.linksService.getLinkById(id);
  }

  @Get('/project/:projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all links for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID', type: String })
  @ApiResponse({ status: 200, description: 'List of project links', type: [LinkDto] })
  @ApiResponse({ status: 404, description: 'Project not found' })
  getProjectLinks(@Param('projectId') projectId: string) {
    return this.linksService.getAllProjectLinks(projectId);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new link' })
  @ApiBody({ type: CreateLinkDto })
  @ApiResponse({ status: 201, description: 'Link created successfully', type: LinkDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createLink(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.createLink(createLinkDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update link' })
  @ApiParam({ name: 'id', description: 'Link ID', type: String })
  @ApiBody({ type: UpdateLinkDto })
  @ApiResponse({ status: 200, description: 'Link updated successfully', type: LinkDto })
  @ApiResponse({ status: 404, description: 'Link not found' })
  updateLink(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.updateLink(id, updateLinkDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete link' })
  @ApiParam({ name: 'id', description: 'Link ID', type: String })
  @ApiResponse({ status: 200, description: 'Link deleted successfully' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  removeLink(@Param('id') id: string) {
    return this.linksService.removeLink(id);
  }
}
