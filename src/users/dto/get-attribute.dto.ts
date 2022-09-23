import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class GetAttributeDto {

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userid: string;

}
