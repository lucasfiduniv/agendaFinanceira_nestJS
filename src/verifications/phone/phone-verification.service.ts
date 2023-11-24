import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { Twilio } from 'twilio';
import { Repository } from 'typeorm';
import { SendPhoneDto } from './dto/send-phone.dto';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class PhoneVerificationService {
  private readonly twilioClient: Twilio;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.twilioClient = new Twilio('ACf1a1aa8cfe6d53027d97e7cc6f534fba', '613935b39648c1fce61a6220b2d1006f');
  }

  private generateRandomDigits(length: number): string {
    const digits = [];
    for (let i = 0; i < length; i++) {
      digits.push(Math.floor(Math.random() * 10).toString());
    }
    return digits.join('');
  }

  async sendVerificationCode(sendPhoneDto: SendPhoneDto): Promise<void> {
    const verificationCode = this.generateRandomDigits(5);
  
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: sendPhoneDto.id },
      });
  
      user.codeValityNumber = verificationCode;
      await this.userRepository.save(user);
  
      await this.twilioClient.messages.create({
        body: `Seu código de verificação: ${verificationCode}`,
        from: '+1 832 981 6775',
        to: sendPhoneDto.phoneNumber,
      });
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
