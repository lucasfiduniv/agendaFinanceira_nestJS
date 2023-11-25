import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { AuthEmailController } from './authEmail.controller';
import { AuthEmailService } from './authEmail.service';
import { JwtMiddleware } from './guard/jwt.middleware';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'suaChaveSecretaAqui',
      signOptions: { expiresIn: '1h' }, // Define o tempo de expiração do token
    }),
  ],
  controllers: [AuthEmailController],
  providers: [AuthEmailService,JwtAuthGuard],
  exports: [AuthEmailService,JwtMiddleware,JwtAuthGuard],
})
export class AuthEmailModule {}
