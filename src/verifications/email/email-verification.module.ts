// user/user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerificationService } from './email-verification.service';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [TypeOrmModule.forFeature([User]),
MailerModule.forRoot({
  transport:{
    host:"smtp.gmail.com",
    auth:{
      user: "lucasgabriel22222222@gmail.com",
      pass: "tpxxcuztqtdejizb"
    }
  }
})
],
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
