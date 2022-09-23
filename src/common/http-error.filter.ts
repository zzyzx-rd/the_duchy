import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ExceptionResponseInterface,
  GlobalResponseError,
} from './response.error.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse =
      exception.getResponse() as ExceptionResponseInterface;
    console.log('exception response :', exceptionResponse);
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();
    console.log('message :', exceptionResponse.message);

    response
      .status(statusCode)
      .json(
        GlobalResponseError(
          statusCode,
          exceptionResponse.message,
          exceptionResponse.error,
          request,
        ),
      );
  }
}
