import { Injectable } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks = (): Task[] => {
    return this.tasks;
  };

  getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = this.tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = this.tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }

  getTaskById = (id: string): Task => {
    const foundTask = this.tasks.find((task) => task.id === id);
    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return foundTask;
  };

  createTask = (createTaskDTO: CreateTaskDTO): Task => {
    const { title, description } = createTaskDTO;
    const newTask: Task = {
      id: uuidv4(),
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(newTask);
    return newTask;
  };

  deleteTask(id: string) {
    const taskToRemove = this.getTaskById(id);
    this.tasks.filter((task) => task.id !== taskToRemove.id);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const indexToUpdate = this.tasks.findIndex((task) => task.id === id);
    const updatedTaskStatus = {
      ...this.tasks[indexToUpdate],
      status: status,
    };

    if (indexToUpdate !== -1) {
      return (this.tasks[indexToUpdate] = {
        ...updatedTaskStatus,
      });
    } else {
      return {
        task: `Task with id ${id} does not exist`,
      };
    }
  }

  updateTask(
    id: string,
    updateTaskDTO: UpdateTaskDTO,
  ): Task | { task: string } {
    const indexToUpdate = this.tasks.findIndex((task) => task.id === id);

    if (indexToUpdate !== -1) {
      return (this.tasks[indexToUpdate] = {
        ...this.tasks[indexToUpdate],
        ...updateTaskDTO,
      });
    } else {
      return {
        task: `Task with id ${id} does not exist`,
      };
    }
  }
}
