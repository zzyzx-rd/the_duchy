import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  Body,
} from '@nestjs/common';
import { ResetPasswordService } from './resetPassword.service';

@Controller('reset-password')
@UseInterceptors(ClassSerializerInterceptor)
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}
}
