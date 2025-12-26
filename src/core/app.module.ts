import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from '@/src/modules/auth/auth.module';
import { LinksModule } from '@/src/modules/links/links.module';
import { NotesModule } from '@/src/modules/notes/notes.module';
import { ProjectsModule } from '@/src/modules/projects/projects.module';
import { TagsModule } from '@/src/modules/tags/tags.module';
import { UsersModule } from '@/src/modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    TagsModule,
    LinksModule,
    NotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
