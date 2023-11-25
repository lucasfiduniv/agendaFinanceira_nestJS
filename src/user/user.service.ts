import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';
import * as bcrypt from 'bcrypt';
import { UpdatePhone } from './dto/updatePhone';

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

    // Criptografe a senha antes de armazená -la no banco de dados
    const saltRounds = 10; // Número de rounds para o algoritmo de hash
    const hashedPassword = await bcrypt.hash(createUserDto.senha, saltRounds);

    const user = new User();
    user.nome = createUserDto.nome;
    user.email = createUserDto.email;
    user.senha = hashedPassword;

    return await this.userRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    const getAllUsers = await this.userRepository.find();
    return getAllUsers;
  }

  async getOneUser(userId: string): Promise<User> {
    const getOneUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!getOneUser) {
      throw new NotFoundException(`Usuário com o ID ${userId} não encontrado`);
    }

    return getOneUser;
  }
  async updatePhoneNumber(updatePhone: UpdatePhone, userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      user.phone = updatePhone.updatePhone;

      const updatedUser = await this.userRepository.save(user);

      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
