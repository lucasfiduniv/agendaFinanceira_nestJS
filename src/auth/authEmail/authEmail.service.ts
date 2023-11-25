import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthEmailService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    let user: User;

    if (loginDto.email) {
      user = await this.userRepository.findOne({ where : {email: loginDto.email }});
    } else if (loginDto.phone) {
      user = await this.userRepository.findOne({ where: {phone: loginDto.phone} });
    } else {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (user) {
      const isPasswordValid = await this.verifyPassword(
        loginDto.senha,
        user.senha, 
      );

      if (isPasswordValid) {
        return user;
      }
    }

    throw new UnauthorizedException('Credenciais inválidas');
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
