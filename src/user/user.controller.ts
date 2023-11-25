import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';
import { UpdatePhone } from './dto/updatePhone';
import { ProtegerRota } from 'src/auth/authEmail/guard/proteger-rota.decorator';

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
  @ProtegerRota() 
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
  @Patch('updatePhone/:id')
  async UpdatePhone(
    @Param('id') userId: string,
    @Body() updatePhone: UpdatePhone,
  ) {
    const updateNumberPhone = await this.userService.updatePhoneNumber(
      updatePhone,
      userId,
    );
    return updateNumberPhone;
  }
}
