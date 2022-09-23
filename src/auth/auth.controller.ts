import {
  Controller,
  UseGuards,
  Request,
  Post,
  Body,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { UsersService } from '@api/users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthDto, AuthResponseDto } from './dto/auth.dto';
import { SkipAuth } from '@decorators/rest';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GetUser } from '@api/decorators/get.user.decorator';
import { User } from '@api/models/users';
import { EmailConfirmationService } from '@api/email/emailConfirmation.service';
import { ResetPasswordService } from '@api/email/resetPassword.service';
import ConfirmCodeDto from '@api/email/dto/confirmCode.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@SkipAuth()
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Post('login')
  @ApiResponse({ type: AuthResponseDto })
  @ApiBody({ type: AuthDto })
  async login(@Body() authDto: AuthDto) {
    return this.authService.userLogin(authDto);
  }


  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }


  @UseGuards(LocalAuthGuard)
  @Post('token')
  async getAuthToken(@Request() req, @Body() authDto: AuthDto) {
    return this.authService.getAuthToken(req.user);
  }

  @Post('/forgotPassword')
  async forgotPassword(
    @Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto,
  ) {
    await this.resetPasswordService.sendCodeToEmail(forgotPasswordDto.email);
  }

  @Patch('/confirmCode')
  async confirmCode(
    @Body(new ValidationPipe()) confirmCodeDto: ConfirmCodeDto,
  ): Promise<boolean> {
    return this.resetPasswordService.confirmCode(confirmCodeDto);
  }

  @Patch('/changePassword') // change password in mobile app
  async changePassword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    return this.usersService.updatePassword(
      changePasswordDto.email,
      changePasswordDto,
    );
  }

  @Post('resetpassword') // reset password with email and token
  @UseGuards(LocalAuthGuard)
  async resetpassword(
    @GetUser() user: User,
    @Body(new ValidationPipe()) resetpasswordData: ChangePasswordDto,
  ): Promise<User> {
    return await this.resetPasswordService.resetPassword(
      user.email,
      resetpasswordData,
    );
  }
}
