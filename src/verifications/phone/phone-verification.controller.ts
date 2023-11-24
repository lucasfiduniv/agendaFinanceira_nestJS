import { Body, Controller, Post } from '@nestjs/common';
import { PhoneVerificationService } from './phone-verification.service';
import { SendPhoneDto } from './dto/send-phone.dto';

@Controller('phone-verification')
export class PhoneVerificationController {
  constructor(
    private readonly phoneVerificationService: PhoneVerificationService,
  ) {}

  @Post('send-code/')
  async sendVerificationCode(
    @Body() sendPhoneDto: SendPhoneDto,
  ){
      await this.phoneVerificationService.sendVerificationCode(sendPhoneDto);
    return { message: 'Código enviado com sucesso.' };
  }
}
