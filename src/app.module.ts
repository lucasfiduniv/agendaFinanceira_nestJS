// app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PhoneVerificationModule } from './verifications/phone/phone-verification.module';
import { User } from './user/entity/user.entity';
import { EmailVerificationModule } from './verifications/email/email-verification.module';
import { AuthEmailModule } from './auth/authEmail/authEmail.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://lucasfiduniv:xfODYR4jdpc2@ep-cold-bonus-87117687-pooler.us-east-2.aws.neon.tech:5432/neondb',
      entities: [User],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    PhoneVerificationModule,
    EmailVerificationModule,
    AuthEmailModule,
  ],
  exports: [JwtModule],
  providers: [
  ],
})
export class AppModule {}