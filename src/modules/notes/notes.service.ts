import { Injectable } from '@nestjs/common';
import { ProjectRecordUpdateInput } from '@prisma/generated/prisma/models/ProjectRecord';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { PaginatedRequestFields } from '@/src/types/types';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  create(projectId: string, createNoteDto: CreateNoteDto) {
    const { links, ...data } = createNoteDto;

    return this.prisma.projectRecord.create({
      data: {
        ...data,
        project: {
          connect: { id: projectId },
        },
        links: links?.length
          ? {
              create: links.map(l => ({
                title: l.title,
                url: l.url,
              })),
            }
          : undefined,
      },
      include: {
        links: true,
      },
    });
  }

  async findAll(projectId: string, paginationFields?: PaginatedRequestFields) {
    const page = paginationFields?.page ?? 1;
    const limit = paginationFields?.limit ?? 100;

    const notes = await this.prisma.projectRecord.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'asc' },
    });

    const totalCount = await this.prisma.projectRecord.count({ where: { projectId } });

    return { data: notes, totalCount: totalCount, page, limit };
  }

  findOne(projectId: string, id: string) {
    return this.prisma.projectRecord.findUnique({
      where: { projectId, id },
    });
  }

  async update(projectId: string, id: string, dto: UpdateNoteDto) {
    const { links, ...rest } = dto;

    // Собираем только те scalar-поля, которые реально пришли
    const data: ProjectRecordUpdateInput = {
      ...(rest.type !== undefined ? { type: rest.type } : {}),
      ...(rest.title !== undefined ? { title: rest.title } : {}),
      ...(rest.value !== undefined ? { value: rest.value } : {}),
      ...(rest.note !== undefined ? { note: rest.note } : {}),
      ...(rest.isSecret !== undefined ? { isSecret: rest.isSecret } : {}),
    };

    // Если links пришли — заменяем все links этой заметки на новый список
    if (links !== undefined) {
      data.links = {
        deleteMany: {},
        create: links.map(l => ({
          title: l.title,
          url: l.url,
        })),
      };
    }

    return this.prisma.projectRecord.update({
      where: { id, projectId },
      data,
      include: { links: true },
    });
  }

  remove(projectId: string, id: string) {
    return this.prisma.projectRecord.delete({
      where: { id, projectId },
    });
  }
}
