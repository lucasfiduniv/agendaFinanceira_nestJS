import { IsPhoneNumber } from 'class-validator';

export class SendEmailDto {
  @IsPhoneNumber('BR')
  email: string;
  id:string;
}