import { IsPhoneNumber } from 'class-validator';

export class SendPhoneDto {
  @IsPhoneNumber('BR')
  phoneNumber: string;

  id: string;
}