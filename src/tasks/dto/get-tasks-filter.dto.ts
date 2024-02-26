import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTaskFilterDto {
  @IsOptional()
  // ! isIn is the same as isEnum .... same error
  // @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
