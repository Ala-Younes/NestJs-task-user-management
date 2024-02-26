import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
  ];
  transform(value: any) {
    //! here we need only the value Status is between 3 values
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} in an invalid status`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    // ! if a status does not exist inside of allowedStatuses array it will return -1
    const index = this.allowedStatuses.indexOf(status);
    return index !== -1;
  }
}
