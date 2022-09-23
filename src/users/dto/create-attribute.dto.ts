import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateAttributeDto {

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userid: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attribute: string;
}
