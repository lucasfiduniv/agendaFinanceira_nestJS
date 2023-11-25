import { Body, Controller, Get, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';
import { UpdatePhone } from './dto/updatePhone';
import { AuthGuard } from '@nestjs/passport';
import { userId } from 'src/decorators/user-id.decorator';

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
  @Get('/myuser')
  async getUserById(@userId() userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Token inválido ou ausente');
    }
  
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
