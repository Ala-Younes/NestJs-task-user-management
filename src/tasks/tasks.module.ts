import { Module } from '@nestjs/common/decorators';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from 'src/database/prisma.module';
import { TasksRepository } from './tasks.repository';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, PrismaService],
  exports: [TasksService],
})
export class TasksModule {}
