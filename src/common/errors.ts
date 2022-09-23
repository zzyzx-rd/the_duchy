import { BadRequestException, HttpException } from '@nestjs/common';
export class PSTheDuchyException extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class MinParticipantsRequiredException extends PSTheDuchyException {
  constructor(message: string) {
    const _message =
      'Tournament will not start until the minimum number of confirmed participants is reached';
    super(`${_message}: ${message}`);
  }
}

export class UnscorableMatchException extends PSTheDuchyException {
  constructor(message: string) {
    const _message = 'Match cannot be scored';
    super(`${_message}: ${message}`);
  }
}
