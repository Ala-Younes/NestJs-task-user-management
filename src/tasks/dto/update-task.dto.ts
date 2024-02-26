import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
