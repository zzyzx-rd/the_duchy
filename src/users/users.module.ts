import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { Attribute } from '@api/models/attributes';
import { User } from '@api/models/users';
import { Repository } from 'typeorm';
 
@Module({
  imports: [TypeOrmModule.forFeature([User, Attribute,]), Repository,
  ],
  providers: [UsersService],
  exports: [UsersService, Repository],
  controllers: [UsersController]
})
export class UsersModule {}