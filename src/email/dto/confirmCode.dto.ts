import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ConfirmCodeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  code: number;
}

export default ConfirmCodeDto;
