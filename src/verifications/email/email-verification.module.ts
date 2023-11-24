// user/user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerificationService } from './email-verification.service';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
