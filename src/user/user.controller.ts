import { Body, Controller, Get, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';
import { UpdatePhone } from './dto/updatePhone';
import { AuthGuard } from '@nestjs/passport';
import { userId } from 'src/decorators/user-id.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';
import { ReturnUserDto } from './dto/returnUserDto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    if (user.senha) {
      delete user.senha;
    }
    const returnUser = new ReturnUserDto(user);
    return returnUser;
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
    const returnUser = new ReturnUserDto(getOneUser);
    return returnUser;
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
