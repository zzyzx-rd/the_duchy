import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UserDto extends OmitType(CreateUserDto, ['password'] as const) {
  @ApiProperty()
  id: string;
}
