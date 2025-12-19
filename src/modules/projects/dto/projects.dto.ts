import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/generated/prisma/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ProjectDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  color?: string;

  @ApiProperty()
  @IsOptional()
  icon?: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty({ enum: ProjectStatus, enumName: 'ProjectStatus' })
  projectStatus: ProjectStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginatedProjectsResponseDto {
  @ApiProperty({ type: [ProjectDto] })
  data: ProjectDto[];

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    enum: ProjectStatus,
    enumName: 'ProjectStatus',
    required: false,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  projectStatus?: ProjectStatus;
}

export class UpdateProjectDto extends CreateProjectDto {
  @ApiProperty()
  id: string;
}
