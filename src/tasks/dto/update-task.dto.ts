import { TaskStatus } from '@prisma/client';

export class UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
