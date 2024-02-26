import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.model';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;
  let filterDto: GetTaskFilterDto;
  beforeEach(() => {
    tasksService = new TasksService();
    tasksController = new TasksController(tasksService);
    filterDto = new GetTaskFilterDto();
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const result: Task[] = [
        {
          id: 'string',
          title: 'string',
          description: 'string',
          status: TaskStatus.DONE,
        },
      ];

      jest.spyOn(tasksService, 'getAllTasks').mockImplementation(() => result);

      expect(tasksController.getTasks(filterDto)).toBe(result);
    });
  });
});
