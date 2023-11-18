import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    if (user.senha) {
      delete user.senha;
    }
    return user;
  }
  @Get()
  async getUsers() {
    const getUsers = await this.userService.getUsers();
    return getUsers;
  }
  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    const getOneUser = await this.userService.getOneUser(userId);
    return getOneUser;
  }
}
