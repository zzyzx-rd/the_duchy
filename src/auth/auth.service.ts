import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { User } from '@models/users';
import { UsersService } from '@api/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user: User = await this.usersService.findByEmail(email);

    if (user && (await user.comparePassword(pass))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      id: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }

  async userLogin(authDto: AuthDto) {
    const user = await this.validateUser(authDto.email, authDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return await this.login(user);
  }

  async getAuthToken(user: User) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
