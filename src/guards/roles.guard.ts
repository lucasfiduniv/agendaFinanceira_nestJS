// roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { authorization } = context.switchToHttp().getRequest().headers;

    console.log('Authorization Header:', authorization);

    if (!authorization) {
      console.error('Token ausente na solicitação');
      return false;
    }

    const token = authorization.split(' ')[1];

    try {
      const loginPayload = await this.jwtService.verifyAsync(token, {
        secret: 'your-secret-key',
      });

      console.log('Token Decoded:', loginPayload);

      if (!loginPayload || !loginPayload.userId) {
        console.error('Payload do token inválido');
        return false;
      }

      const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        console.log('Sem restrições de roles');
        return true;
      }

      console.log('Roles necessários:', requiredRoles);

      const user = await this.userRepository.findOne({
        where: { id: loginPayload.userId },
        select: ['role'],
      });
      

      if (!user) {
        console.error('Usuário não encontrado no banco de dados');
        return false;
      }

      console.log('Roles do usuário:', user.role);

      return requiredRoles.some((role) => user.role === role);
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return false;
    }
  }
}
