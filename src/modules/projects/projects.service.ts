import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/generated/prisma/client';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { PaginatedRequestFields, PaginatedResponse } from '@/src/types/types';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getProjects(
    userId: string,
    paginationFields?: PaginatedRequestFields,
  ): Promise<PaginatedResponse<Project>> {
    const page = paginationFields?.page ?? 1;
    const limit = paginationFields?.limit ?? 10;

    console.log('page', page);
    console.log('limit', limit);

    const projects = await this.prisma.project.findMany({ where: { ownerId: userId } });
    const totalCount = await this.prisma.project.count({ where: { ownerId: userId } });

    return { data: projects, totalCount: totalCount, limit, page };
  }
}
