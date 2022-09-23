import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { MockType } from './../mock.type';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    findOneOrFail: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  }),
);

export const mockedJwtServiceFactory: () => MockType<JwtService> = jest.fn(
  () => ({
    sign: jest.fn(),
    signAsync: jest.fn(),
    verify: jest.fn(),
    verifyAsync: jest.fn(),
    decode: jest.fn(),
  }),
);

// export const games;
