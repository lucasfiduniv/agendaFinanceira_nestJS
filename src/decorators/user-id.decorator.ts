import { ExecutionContext, createParamDecorator, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export const userId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { authorization } = request.headers;

    console.log('Authorization Header:', authorization);

    if (!authorization) {
      console.error('Token ausente na solicitação');
      return null; // ou lança um erro, dependendo da sua lógica
    }

    const token = authorization.split(' ')[1]; // Remova 'Bearer ' do início do cabeçalho

    try {
      const configService = new ConfigService(); // Instancia o ConfigService
      const jwtSecret = configService.get<string>('JWT_SECRET_KEY'); // Obtém o segredo do env

      const decoded = jwt.verify(token, jwtSecret) as { userId: string }; // Adiciona a tipagem adequada

      console.log('Token Decoded:', decoded);

      return decoded.userId;
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return null; // ou lança um erro, dependendo da sua lógica
    }
  }
);
