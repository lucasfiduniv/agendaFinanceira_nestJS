import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { AuthEmailModule } from 'src/auth/authEmail/authEmail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthEmailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
