// verification.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { SendEmailDto } from './dto/emailVerification.dto';
import { SendEmailValidacaoDto } from './dto/emailValidacao.dto';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(private readonly verificationService: EmailVerificationService) {}

  @Post('send-code')
  async sendVerificationCode(@Body() sendEmailDto: SendEmailDto) {
    await this.verificationService.sendVerificationCode(sendEmailDto);
    return { message: 'Código de verificação enviado com sucesso.' };
  }
  @Post('validaty-code')
  async validateCode(@Body() sendEmailValidacaoDto: SendEmailValidacaoDto) {
    const validacao = await this.verificationService.sendValidationCode(
      sendEmailValidacaoDto,
    );
    return validacao;
  }
}
