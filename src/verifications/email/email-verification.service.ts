import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/emailVerification.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  private generateRandomDigits(length: number): string {
    const digits = [];
    for (let i = 0; i < length; i++) {
      digits.push(Math.floor(Math.random() * 10).toString());
    }
    return digits.join('');
  }

  async sendVerificationCode(sendEmailDto: SendEmailDto): Promise<void> {
    const verificationCode = this.generateRandomDigits(5);
    const code = verificationCode;

    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: sendEmailDto.id },
      });

      user.codeValityNumber = code;
      await this.userRepository.save(user);

      await this.mailerService.sendMail({
        to: 'lucfiduniv@gmail.com',
        from: 'lucasfiduniv22222222@gmail.com',
        subject: 'Testing',
        text: `Seu código de verificação: ${code}`,
        html: `<p>Seu código de verificação: <strong>${code}</strong></p>`,
      });
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
