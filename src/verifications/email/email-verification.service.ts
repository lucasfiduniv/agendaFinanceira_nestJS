import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/emailVerification.dto';
import { User } from 'src/user/entity/user.entity';
import { SendEmailValidacaoDto } from './dto/emailValidacao.dto';
import { error } from 'console';

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
        to: sendEmailDto.email,
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
  async sendValidationCode(sendEmailValidacaoDto: SendEmailValidacaoDto): Promise<boolean> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: sendEmailValidacaoDto.id },
      });

      const userr =  await this.userRepository.findOne({where:{id: sendEmailValidacaoDto.id}})

      if (user.codeValityNumber === sendEmailValidacaoDto.code) {
        user.emailVality = true;
        const updateUser = {
          emailVality: true
        }
        await this.userRepository.update(sendEmailValidacaoDto.id, updateUser);
       
      await this.userRepository
       .createQueryBuilder()
       .update(User)
       .set({ codeValityNumber: null })   
       .where("id = :id", { id: sendEmailValidacaoDto.id })
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
