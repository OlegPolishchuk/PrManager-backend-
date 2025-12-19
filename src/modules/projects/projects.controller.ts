import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProjectsService } from './projects.service';

import { AuthGuard } from '@/src/modules/auth/auth.guard';
import {
  CreateProjectDto,
  PaginatedProjectsResponseDto,
  ProjectDto,
  UpdateProjectDto,
} from '@/src/modules/projects/dto/projects.dto';
import { RequestWithJWTPayload } from '@/src/types/types';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Get user projects with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, type: PaginatedProjectsResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllProjects(
    @Req() req: RequestWithJWTPayload,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.projectsService.getProjects(req.user.sub, { page, limit });
  }

  @ApiOperation({ summary: 'Create new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, type: ProjectDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: RequestWithJWTPayload,
  ) {
    const userId = req.user.sub;

    return this.projectsService.createProject(createProjectDto, userId);
  }

  @ApiOperation({ summary: 'Update project' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, type: ProjectDto })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  updateProject(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    console.log('projectId =>', id);

    return this.projectsService.updateProject(updateProjectDto);
  }
}
