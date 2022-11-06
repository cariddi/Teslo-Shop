import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([User])], // this will trigger typeorm to create required table/s
  exports: [TypeOrmModule], // this will export typeorm module with its configurations (User related in this case)
})
export class AuthModule {}
