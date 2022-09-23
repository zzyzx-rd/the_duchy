import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const _logger = new Logger();
  _logger.log(`${req.method} ${req.url}`, 'TheDuchyApplication');
  next();
}
