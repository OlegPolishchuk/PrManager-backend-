import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProjectsService } from './projects.service';

import { AuthGuard } from '@/src/modules/auth/auth.guard';
import { RequestWithJWTPayload } from '@/src/types/types';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

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
