import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from '@models/users';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { Attribute } from '@api/models/attributes';
import { GetAttributeDto } from './dto/get-attribute.dto';
import { ChangePasswordDto } from '@api/auth/dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new HttpException('User is not registered', HttpStatus.NOT_FOUND);
    }
    return user;
  }
  async findAll(params?: FindManyOptions<User>): Promise<User[]> {
    return await this.usersRepository.find(params);
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneOrFail({ email });
  }
  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ username });
  }
  async findById(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  
  async create(createUserDto: CreateUserDto): Promise<User> {
    //This is a simple way to map DTO -> Entity the only condition is that properties must have the same names.
    const user = Object.assign(<User>{}, createUserDto);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    const createdUser = await this.usersRepository.save(user);

    return createdUser;
  }

  async updatePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.findOne(id);

    const salt = await bcrypt.genSalt();
    const validPassword = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!validPassword) {
      throw new HttpException('Old password is incorrect', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      salt,
    );
    user.password = hashedPassword;
    return this.usersRepository.save(user);
  }

  async updateAttribute(attributeDto: CreateAttributeDto) {
    const user = await this.findOne(attributeDto.userid);

    if (!user) {
      throw new HttpException('user is not existing', HttpStatus.NOT_FOUND);
    }

    const _userattribute = await this.attributeRepository.findOne({
      where: {
        id: user.attributeId,
      },
    });
    if (_userattribute == undefined) {
      const userattribute = Object.assign(<Attribute>{}, attributeDto);
      const savedAttribute = await this.attributeRepository.save(userattribute);

      user.attributeId = savedAttribute.id;
      const updatedUser = await this.usersRepository.save(user);
      return updatedUser;
    } else {
      _userattribute.attribute = attributeDto.attribute;
      await this.attributeRepository.save(_userattribute);
      return user;
    }
  }

  async getAttribute(attributeDto: GetAttributeDto) {
    const user = await this.findOne(attributeDto.userid);
    const userattribute = await this.attributeRepository.findOne({
      where: {
        id: user.attributeId,
      },
    });
    return userattribute;
  }
}