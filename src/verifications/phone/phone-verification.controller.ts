import { Body, Controller, Post } from '@nestjs/common';
import { PhoneVerificationService } from './phone-verification.service';
import { SendPhoneDto } from './dto/send-phone.dto';
import { SendEmailValidacaoDto } from '../email/dto/emailValidacao.dto';

@Controller('phone-verification')
export class PhoneVerificationController {
  constructor(
    private readonly phoneVerificationService: PhoneVerificationService,
  ) {}

  @Post('send-code/')
  async sendVerificationCode(@Body() sendPhoneDto: SendPhoneDto) {
    await this.phoneVerificationService.sendVerificationCode(sendPhoneDto);
    return { message: 'Código enviado com sucesso.' };
  }
  @Post('validaty-code')
  async validateCode(@Body() sendPhoneValidacaoDto: SendEmailValidacaoDto) {
    const validacao = await this.phoneVerificationService.sendValidationCode(
      sendPhoneValidacaoDto,
    );
    return validacao;
  }
  
}
