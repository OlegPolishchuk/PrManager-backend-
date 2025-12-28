import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/generated/prisma/client';
import { RecordType } from '@prisma/generated/prisma/enums';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { NoteDto } from '@/src/modules/notes/dto/note.dto';
import { PaginatedRequestFields } from '@/src/types/types';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  create(projectId: string, dto: CreateNoteDto) {
    // Если NOTE — records могут быть пустыми (по твоей модели)
    if (dto.type !== RecordType.NOTE && !dto.records?.length) {
      throw new BadRequestException('records must not be empty');
    }

    // Если NOTE — items/links можно не создавать
    const records = dto.records ?? [];

    const links =
      records.flatMap(r => r.links?.map(l => ({ title: l.title, url: l.url })) ?? []) ??
      [];

    return this.prisma.projectRecord.create({
      data: {
        project: { connect: { id: projectId } },
        type: dto.type,
        groupTitle: dto.groupTitle,
        note: dto.note,
        items: records.length
          ? { create: records.map(r => ({ title: r.title, value: r.value })) }
          : undefined,
        links: links.length
          ? { create: links.map(l => ({ title: l.title, url: l.url })) }
          : undefined,
      },
      include: { items: true, links: true },
    });
  }

  async findAll(projectId: string, paginationFields?: PaginatedRequestFields) {
    const page = paginationFields?.page ?? 1;
    const limit = paginationFields?.limit ?? 100;

    const rows = await this.prisma.projectRecord.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'asc' },
      include: { items: true, links: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log('rows =>', rows);

    const totalCount = await this.prisma.projectRecord.count({ where: { projectId } });

    const data: NoteDto[] = rows.map(r => ({
      id: r.id,
      type: r.type,
      note: r.note ?? undefined,
      groupTitle: r.groupTitle ?? undefined,
      records: r.items.map(i => ({
        id: i.id,
        recordId: i.recordId,
        title: i.title,
        value: i.value,
      })),
      links: r.links.map(l => ({
        id: l.id,
        recordId: l.recordId,
        title: l.title ?? undefined,
        url: l.url,
      })),
      projectId: r.projectId,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    return { data, totalCount, page, limit };
  }

  async findOne(projectId: string, id: string) {
    const r = await this.prisma.projectRecord.findFirst({
      where: { id, projectId },
      include: { items: true, links: true },
    });

    if (!r) return null;

    const dto: NoteDto = {
      id: r.id,
      type: r.type,
      note: r.note ?? undefined,
      groupTitle: r.groupTitle ?? undefined,
      records: r.items.map(i => ({
        id: i.id,
        recordId: i.recordId,
        title: i.title,
        value: i.value,
      })),
      links: r.links.map(l => ({
        id: l.id,
        recordId: l.recordId,
        title: l.title ?? undefined,
        url: l.url,
      })),
      projectId: r.projectId,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };

    return dto;
  }

  async update(projectId: string, id: string, dto: UpdateNoteDto) {
    // (опционально, но правильно) проверяем принадлежность заметки проекту
    const existing = await this.prisma.projectRecord.findFirst({
      where: { id, projectId },
      select: { id: true },
    });
    if (!existing) throw new BadRequestException('Note not found');

    const data: Prisma.ProjectRecordUpdateInput = {
      ...(dto.groupTitle !== undefined ? { groupTitle: dto.groupTitle } : {}),
      ...(dto.note !== undefined ? { note: dto.note } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
    };

    if (dto.records !== undefined) {
      // Если по правилам non-NOTE всегда должен иметь records — проверяй здесь.
      // Если NOTE может быть без records — убери/смягчи эту проверку.
      if (dto.records.length === 0) {
        throw new BadRequestException('records must not be empty');
      }

      const links =
        dto.records.flatMap(
          r => r.links?.map(l => ({ title: l.title, url: l.url })) ?? [],
        ) ?? [];

      data.items = {
        deleteMany: {}, // удалит все связанные items у этой записи
        create: dto.records.map(r => ({
          title: r.title,
          value: r.value,
        })),
      };

      data.links = links.length
        ? {
            deleteMany: {}, // удалит все связанные links у этой записи
            create: links.map(l => ({
              title: l.title,
              url: l.url,
            })),
          }
        : {
            deleteMany: {}, // если ссылок не пришло — просто очищаем
          };
    }

    return this.prisma.projectRecord.update({
      where: { id },
      data,
      include: { items: true, links: true },
    });
  }

  async remove(projectId: string, id: string) {
    // чтобы гарантировать принадлежность проекту — проверяем, затем удаляем по unique id
    const existing = await this.prisma.projectRecord.findFirst({
      where: { id, projectId },
      select: { id: true },
    });

    if (!existing) throw new BadRequestException('Note not found');

    return this.prisma.projectRecord.delete({ where: { id } });
  }
}
