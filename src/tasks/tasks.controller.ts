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
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { ValidationPipe } from '@nestjs/common/pipes';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[] {
    // ! depending of query params
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get(':id')
  getTaskById(@Param('id') taskId: string): Task {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  createTask(@Body(ValidationPipe) createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Delete(':id')
  deleteTask(@Param('id') taskId: string) {
    return this.tasksService.deleteTask(taskId);
  }

  @Patch(':id')
  updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
  ) {
    return this.tasksService.updateTask(taskId, updateTaskDTO);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') taskId: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ) {
    return this.tasksService.updateTaskStatus(taskId, status);
  }
}
