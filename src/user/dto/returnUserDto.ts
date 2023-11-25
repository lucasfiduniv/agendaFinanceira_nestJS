import { CreateUserDto } from "./createUserDto";

export class ReturnUserDto {
  constructor(createUserDto: CreateUserDto) {
    this.nome = createUserDto.nome;
    this.email = createUserDto.email;
  }

  nome: string;
  email: string;
}
