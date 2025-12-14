import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProjectsService } from './projects.service';

import { AuthGuard } from '@/src/modules/auth/auth.guard';
import { PaginatedProjectsResponseDto } from '@/src/modules/projects/dto/projects.dto';
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
}
