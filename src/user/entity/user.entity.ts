import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('user')
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @Column()
  email: string;

  @IsNotEmpty()
  @Column()
  @Length(6, 50)
  senha: string;

  @IsNotEmpty()
  @Column()
  nome: string;

  @Column({ nullable: true })
  @IsPhoneNumber('BR')
  phone: string;

  @Column({ nullable: true })
  emailVality: boolean;

  @Column({ nullable: true })
  phoneVality: boolean;

  @Column({ nullable: true })
  codeValityNumber: string;
}
