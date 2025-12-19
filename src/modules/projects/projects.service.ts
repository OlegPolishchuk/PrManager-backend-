import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/generated/prisma/client';
import { ProjectCreateInput } from '@prisma/generated/prisma/models/Project';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
} from '@/src/modules/projects/dto/projects.dto';
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

    const projects = await this.prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: 'asc' },
    });
    const totalCount = await this.prisma.project.count({ where: { ownerId: userId } });

    return { data: projects, totalCount: totalCount, limit, page };
  }

  getProjectById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        links: {
          include: {
            tags: true,
          },
        },
      },
    });
  }

  async createProject(createProjectDto: CreateProjectDto, userId: string) {
    return this.prisma.project.create({
      data: { ...createProjectDto, owner: { connect: { id: userId } } },
    });
  }

  async updateProject(updateProjectDto: UpdateProjectDto) {
    const { id, ...restData } = updateProjectDto;

    return this.prisma.project.update({
      where: { id },
      data: restData,
    });
  }

  removeProject(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
