import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UpdatePhone {
//  @IsPhoneNumber('BR')
  updatePhone: string;
}
