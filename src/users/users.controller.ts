import { Like } from 'typeorm';

import { SkipAuth } from '@decorators/rest';
import { UserDto } from './dto/user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ChangePasswordDto } from '@api/auth/dto/change-password.dto';
import { Attribute } from '@api/models/attributes';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { GetAttributeDto } from './dto/get-attribute.dto';
@ApiTags('users')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SkipAuth()
  @Post()
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: UserDto,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    type: UserDto,
    isArray: true,
  })
  async findAll(): Promise<UserDto[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    type: UserDto,
  })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return user;
  }

  @Get('autocomplete/:query')
  @ApiResponse({
    type: UserDto,
  })
  async autocomplete(@Param('query') query: string, @Res() response: Response) {
    const user = await this.usersService.findAll({
      where: {
        username: Like(`${query}%`),
      },
    });

    response
      .status(user ? HttpStatus.OK : HttpStatus.NOT_FOUND)
      .send(JSON.stringify(user));
  }

  @Patch(':id/updatePassword')
  updatePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.updatePassword(id, changePasswordDto);
  }


  @SkipAuth()
  @Post('updateattribute')
  @ApiCreatedResponse({
    description: 'Attribute successfully updated',
    type: Attribute,
  })
  async updateAttribute(
    @Body() attributeDto: CreateAttributeDto,
  ): Promise<UserDto> {
    return await this.usersService.updateAttribute(attributeDto);
  }

  @SkipAuth()
  @Post('getattribute')
  async getAttribute(
    @Body() attributeDto: GetAttributeDto,
  ): Promise<Attribute> {
    return await this.usersService.getAttribute(attributeDto);
  }
}
