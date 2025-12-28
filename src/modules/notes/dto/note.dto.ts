import { ApiProperty } from '@nestjs/swagger';
import { RecordType } from '@prisma/generated/prisma/enums';

export class RecordLinkDto {
  @ApiProperty() id: string;
  @ApiProperty() recordId: string;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty() url: string;
}

export class RecordItemDto {
  @ApiProperty() id: string;

  @ApiProperty() recordId: string;

  @ApiProperty() title: string;

  @ApiProperty() value: string;
}

export class NoteDto {
  @ApiProperty() id: string;

  @ApiProperty({ enum: RecordType, enumName: 'RecordType' })
  type: RecordType;

  // NOTE
  @ApiProperty({ required: false, description: 'Markdown/text note (only for NOTE)' })
  note?: string;

  // НЕ NOTE
  @ApiProperty({ required: false, description: 'Group title (only for non-NOTE types)' })
  groupTitle?: string;

  @ApiProperty({
    type: [RecordItemDto],
    description: 'Group records (title/value pairs)',
  })
  records: RecordItemDto[];

  @ApiProperty({ type: [RecordLinkDto], description: 'Record links' })
  links: RecordLinkDto[];

  @ApiProperty() projectId: string;

  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class PaginatedProjectRecordsResponseDto {
  @ApiProperty({ type: [NoteDto] })
  data: NoteDto[];

  @ApiProperty() totalCount: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
}

export function toNoteDto(r: any): NoteDto {
  return {
    id: r.id,
    type: r.type,
    note: r.note ?? undefined,
    groupTitle: r.groupTitle ?? undefined,

    // rename items -> records
    records: (r.items ?? []).map((i: any) => ({
      id: i.id,
      recordId: i.recordId,
      title: i.title,
      value: i.value,
    })),

    links: (r.links ?? []).map((l: any) => ({
      id: l.id,
      recordId: l.recordId,
      title: l.title ?? undefined,
      url: l.url,
    })),

    projectId: r.projectId,
    createdAt:
      r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    updatedAt:
      r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt),
  };
}
