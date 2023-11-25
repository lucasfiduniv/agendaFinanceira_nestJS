import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config'; // Adicione esta importação
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthEmailService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    let user: User;

    if (loginDto.email) {
      user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    } else if (loginDto.phone) {
      user = await this.userRepository.findOne({ where: { phone: loginDto.phone } });
    } else {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await this.verifyPassword(loginDto.senha, user.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const jwtSecret = this.configService.get<string>('JWT_SECRET_KEY');
    const payload = { userId: user.id, sub: user.id, typeUser: user.role }; // Adicione typeUser ao payload
    const access_token = this.jwtService.sign(payload, { secret: jwtSecret });
  
    return {
      access_token,
    };
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
