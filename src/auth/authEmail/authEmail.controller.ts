import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthEmailService } from './authEmail.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthEmailController {
  constructor(private readonly authService: AuthEmailService) {}

  @Post('login')
  async login(@Body() loginDto : LoginDto): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(loginDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.authService.login(user);
  }
}
