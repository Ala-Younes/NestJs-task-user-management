import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common/decorators';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { Task } from '@prisma/client';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
  ): Promise<Task[]> {
    // ! depending of query params
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) taskId: number) {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  createTask(
    @Body(ValidationPipe) createTaskDTO: CreateTaskDTO,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) taskId: number) {
    return this.tasksService.removeTask(taskId);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() updateTaskDTO: UpdateTaskDTO,
  ) {
    return this.tasksService.updateTask(taskId, updateTaskDTO);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) taskId: number,
    @Body('status', TaskStatusValidationPipe) status: Task['status'],
  ) {
    return this.tasksService.updateTaskStatus(taskId, status);
  }
}
