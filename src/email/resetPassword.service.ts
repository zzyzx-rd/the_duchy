import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import VerificationTokenPayload from './verificationTokenPayload.interface';
import EmailService from './email.service';
import { UsersService } from '@api/users/users.service';
import { UpdateUserDto } from '@api/users/dto/update-user.dto';
import { PasswordVerification } from '@api/models/password_verification';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmCodeDto } from './dto/confirmCode.dto';
import { ChangePasswordDto } from '@api/auth/dto/change-password.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,

    @InjectRepository(PasswordVerification)
    private usersCodeRepository: Repository<PasswordVerification>,
  ) {}

  public async resetPassword(
    email: string,
    changePasswordDto: ChangePasswordDto,
  ) {
    return await this.usersService.updatePassword(email, changePasswordDto);
  }


  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async sendResetPasswordLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    const url = `${this.configService.get(
      'RESET_PASSWORD_URL',
    )}?token=${token}`;

    const text = `To reset your password, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Reset password',
      text,
    });
  }

  public async sendCodeToEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user === undefined) return false;

    const code = Math.floor(100000 + Math.random() * 900000);

    const confirmCode = new ConfirmCodeDto();
    confirmCode.email = email;
    confirmCode.code = code;

    await this.updateConfirmCode(confirmCode);

    const text = `Your Verification Code: ${code}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Code verification',
      text,
    });
  }

  async updateConfirmCode(confirmCode: ConfirmCodeDto) {
    const existingCode = await this.findByEmail(confirmCode.email);
    if (existingCode === undefined) {
      await this.createCodeForUser(confirmCode);
    } else {
      existingCode.code = confirmCode.code;
      existingCode.createdAt = new Date(Date.now());
      await this.usersCodeRepository.save(existingCode);
    }
  }
  async createCodeForUser(
    confirmCode: ConfirmCodeDto,
  ): Promise<PasswordVerification> {
    //This is a simple way to map DTO -> Entity the only condition is that properties must have the same names.
    const userCode = Object.assign(<PasswordVerification>{}, confirmCode);
    userCode.createdAt = new Date(Date.now());
    userCode.expiresIn = 60 * 60 * 5; // 5 hours
    const createdUserCode = await this.usersCodeRepository.save(userCode);
    return createdUserCode;
  }
  async findByEmail(email: string): Promise<PasswordVerification | undefined> {
    return this.usersCodeRepository.findOne({ email: email });
  }

  public async confirmCode(confrimCodeDto: ConfirmCodeDto) {
    const userCode = await this.findByEmail(confrimCodeDto.email);
    if (userCode === undefined) return false;

    if (userCode.code !== confrimCodeDto.code) {
      throw new BadRequestException('Confirm Code is invalid');
    } else {
      const diffSeconds =
        new Date().getTime() / 1000 - userCode.createdAt.getTime() / 1000;
      if (diffSeconds > userCode.expiresIn) {
        throw new BadRequestException('Confirm Code is expired');
      }
    }
    return true;
  }
}
