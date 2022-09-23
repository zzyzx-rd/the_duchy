import { User } from '@api/models/users';
import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((req, data): User => req.user);
