import { Module } from '@nestjs/common/decorators';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TasksModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
