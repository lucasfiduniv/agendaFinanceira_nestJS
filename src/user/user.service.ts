import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { nome: createUserDto.nome },
    });

    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('O nome de usuário já está em uso.');
    }

    if (existingEmail) {
      throw new BadRequestException('O e-mail já está em uso.');
    }

    // Criptografe a senha antes de armazená-la no banco de dados
    const saltRounds = 10; // Número de rounds para o algoritmo de hash
    const hashedPassword = await bcrypt.hash(createUserDto.senha, saltRounds);

    const user = new User();
    user.nome = createUserDto.nome;
    user.email = createUserDto.email;
    user.senha = hashedPassword;

    return await this.userRepository.save(user);
  }
}
