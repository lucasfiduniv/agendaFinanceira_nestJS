// jwt.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtAuthGuard: JwtAuthGuard) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const protegerRota = Reflect.getMetadata('protegerRota', req.route.handler);

    if (protegerRota) {
      // Use o JwtAuthGuard para validar o token apenas se o decorador estiver presente
      await this.jwtAuthGuard.canActivate({ switchToHttp: () => ({ getRequest: () => req }) } as any, next);
    } else {
      next();
    }
  }
}
