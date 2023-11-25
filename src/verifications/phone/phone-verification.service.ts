import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { Twilio } from 'twilio';
import { Repository } from 'typeorm';
import { SendPhoneDto } from './dto/send-phone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SendEmailValidacaoDto } from '../email/dto/emailValidacao.dto';

@Injectable()
export class PhoneVerificationService {
  private readonly twilioClient: Twilio;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.twilioClient = new Twilio(
      'AC3aebb5ebe3381645457a8c0de67718f9',
      '7e2c758fdcb319583c3e95e8bc6a01ec',
    );
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
        from: '+15413264621',
        to: sendPhoneDto.phoneNumber,
      });
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Usuário não encontrado');
    }
  }
  async sendValidationCode(
    sendPhoneValidacaoDto: SendEmailValidacaoDto,
  ): Promise<boolean> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: sendPhoneValidacaoDto.id },
      });

      const userr = await this.userRepository.findOne({
        where: { id: sendPhoneValidacaoDto.id },
      });

      if (user.codeValityNumber === sendPhoneValidacaoDto.code) {
        user.emailVality = true;
        const updateUser = {
          emailVality: true,
        };
        await this.userRepository.update(sendPhoneValidacaoDto.id, updateUser);

        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({ codeValityNumber: null })
          .where('id = :id', { id: sendPhoneValidacaoDto.id })
          .execute();

        // await this.userRepository.query(`UPDATE user SET codeValityNumber = ${null} WHERE public.user.id = ${sendEmailValidacaoDto.id}`)
        return true;
      } else {
        throw new NotFoundException('Código inválido');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error(error);
        throw new NotFoundException('Usuário não encontrado');
      }
    }
  }
}
