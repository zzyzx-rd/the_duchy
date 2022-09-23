import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '@api/users/users.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JWT_SECRET } from '../const/auth';
import { EmailConfirmationService } from '@api/email/emailConfirmation.service';
import { ResetPasswordService } from '@api/email/resetPassword.service';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '@api/email/email.module';
import { Repository } from 'typeorm';
import { PasswordVerification } from '@api/models/password_verification';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { MailModule } from '../mail/mail.module';
@Module({
  imports: [
    UsersModule,
    // MailModule,
    PassportModule,
    ConfigModule,
    EmailModule,
    TypeOrmModule.forFeature([PasswordVerification]),
    JwtModule.register({
      secret: JWT_SECRET,
      // expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).
      // Eg: 60, "2 days", "10h", "7d"
      // TODO: Decide sweetspot for token expiration
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    EmailConfirmationService,
    ResetPasswordService,
    Repository,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtModule,
    EmailConfirmationService,
    ResetPasswordService,
  ],
})
export class AuthModule {}
