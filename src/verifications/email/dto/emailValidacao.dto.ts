import { IsPhoneNumber } from 'class-validator';

export class SendEmailValidacaoDto {
  code: string;
  id:string;
}