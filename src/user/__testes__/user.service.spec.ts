import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user.service';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/createUserDto';
import { NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        nome: 'TestUser',
        email: 'test@example.com',
        senha: 'password',
      };

      const hashedPassword = 'hashedpassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const saveSpy = jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        id: '1',
        ...createUserDto,
        senha: hashedPassword,
      });

      const result = await userService.createUser(createUserDto);

      expect(saveSpy).toHaveBeenCalledWith(expect.any(User));
      expect(result).toEqual({ id: '1', ...createUserDto, senha: hashedPassword });
    });

    it('should throw BadRequestException if username is already in use', async () => {
      const createUserDto: CreateUserDto = {
        nome: 'ExistingUser',
        email: 'test@example.com',
        senha: 'password',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(createUserDto);

      await expect(userService.createUser(createUserDto)).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if email is already in use', async () => {
      const createUserDto: CreateUserDto = {
        nome: 'TestUser',
        email: 'existing@example.com',
        senha: 'password',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(createUserDto);

      await expect(userService.createUser(createUserDto)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('getOneUser', () => {
    it('should get a user by ID', async () => {
      const userId = '1';
      const userMock: User = {
        id: userId,
        nome: 'TestUser',
        email: 'test@example.com',
        senha: 'hashedpassword',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userMock);

      const result = await userService.getOneUser(userId);

      expect(result).toEqual(userMock);
    });

    it('should throw UnauthorizedException if ID is empty or invalid', async () => {
      const invalidUserId = '';

      await expect(userService.getOneUser(invalidUserId)).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 'nonexistent';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(userService.getOneUser(userId)).rejects.toThrowError(NotFoundException);
    });
  });
});
