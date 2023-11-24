// email.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/emailVerification.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class EmailVerificationService {
  private transporter;
  private readonly userRepository:Repository<User>
  private generateRandomDigits(length: number): string {
    const digits = [];
    for (let i = 0; i < length; i++) {
      digits.push(Math.floor(Math.random() * 10).toString());
    }
    return digits.join('');
  }

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lucasfidunivteste@gmail.com',
        pass: '258456ek',
      },
    });
  }

  async sendVerificationCode(sendEmailDto:SendEmailDto): Promise<void> {
    const verificationCode = this.generateRandomDigits(5);
    const code = verificationCode;
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: sendEmailDto.id },
      });
      user.codeValityNumber = code;
      await this.userRepository.save(user);
   
    const mailOptions = {
      from: 'lucasfidunivteste@gmail.com',
      to: sendEmailDto.email,
      subject: 'Código de Verificação',
      text: `Seu código de verificação: ${code}`,
    };

    await this.transporter.sendMail(mailOptions);
     } catch (error) {
      console.error(error);
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
