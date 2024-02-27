import { TasksRepository } from './tasks.repository';
import { Injectable } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Task } from '@prisma/client';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  getAllTasks = async (): Promise<Task[]> => {
    return this.tasksRepository.getTasks({});
  };

  async getTasksWithFilters(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const result = await this.tasksRepository.getTasks({
      where: {
        OR: [
          {
            status,
          },
          {
            description: search,
          },
          {
            title: search,
          },
        ],
      },
    });

    return result;
  }

  getTaskById = async (id: Task['id']): Promise<Task> => {
    const foundTask = await this.tasksRepository.getTaskById({
      where: {
        id,
      },
    });

    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return foundTask;
  };

  createTask = async (createTaskDTO: CreateTaskDTO): Promise<Task> => {
    const { title, description } = createTaskDTO;
    const newTask = await this.tasksRepository.createTask({
      data: {
        title,
        description,
        status: 'OPEN',
      },
    });
    return newTask;
  };

  async updateTaskStatus(id: Task['id'], status: Task['status']) {
    const foundTask = await this.tasksRepository.getTaskById({
      where: {
        id,
      },
    });
    if (!foundTask) throw new NotFoundException(`Task with ID ${id} not found`);
    // update it
    this.tasksRepository.updateTask({
      data: {
        status,
      },
      where: {
        id,
      },
    });
  }

  async updateTask(id: Task['id'], updateTaskDTO: UpdateTaskDTO) {
    const foundTask = await this.tasksRepository.getTaskById({
      where: {
        id,
      },
    });
    if (!foundTask) throw new NotFoundException(`Task with ID ${id} not found`);
    // update it
    const { description, title, status } = updateTaskDTO;
    return this.tasksRepository.updateTask({
      data: {
        description,
        title,
        status,
      },
      where: {
        id,
      },
    });
  }

  async removeTask(id: Task['id']) {
    const foundTask = await this.tasksRepository.getTaskById({
      where: {
        id,
      },
    });
    if (!foundTask) throw new NotFoundException(`Task with ID ${id} not found`);

    // delete it
    const deleteTask = await this.tasksRepository.deleteTask({
      where: {
        id,
      },
    });

    return {
      statusCode: 200,
      data: deleteTask,
      message: `Success delete ${id}`,
    };
  }
}
