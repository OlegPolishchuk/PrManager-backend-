import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { CreateLinkDto } from '@/src/modules/links/dto/create-link.dto';
import { UpdateLinkDto } from '@/src/modules/links/dto/update-link.dto';
import { PaginatedRequestFields } from '@/src/types/types';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  getLinkById(id: string) {
    return this.prisma.link.findUnique({ where: { id } });
  }

  async getAllProjectLinks(projectId: string, paginationFields?: PaginatedRequestFields) {
    const page = paginationFields?.page ?? 1;
    const limit = paginationFields?.limit ?? 100;

    const links = await this.prisma.link.findMany({
      where: { projectId },
    });
    const totalCount = await this.prisma.link.count({ where: { projectId } });

    return { data: links, totalCount: totalCount, page, limit };
  }

  createLink(linkDto: CreateLinkDto) {
    const { tagIds, projectId, ...data } = linkDto;

    console.log('projectId =>', projectId);
    console.log('linkDto =>', linkDto);

    return this.prisma.link.create({
      data: {
        ...data,
        project: { connect: { id: projectId } },
        tags: tagIds?.length
          ? {
              connect: tagIds.map(id => ({ id })),
            }
          : undefined,
      },
      include: {
        tags: true,
      },
    });
  }

  updateLink(linkId: string, linkDto: UpdateLinkDto) {
    return this.prisma.link.update({
      where: { id: linkId },
      data: linkDto,
    });
  }

  removeLink(id: string) {
    return this.prisma.link.delete({ where: { id } });
  }
}
