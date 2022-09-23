export interface ErrorResponseInterface {
  statusCode: number;
  message: any;
  error: string;
  timestamp: string;
  path: string;
  method: string;
}

export interface ExceptionResponseInterface {
  statusCode: number;
  message: any;
  error: string;
}

export const GlobalResponseError: (
  statusCode: number,
  error: string,
  message: any,
  request: Request,
) => ErrorResponseInterface = (
  statusCode: number,
  error: string,
  message: any,
  request: Request,
): ErrorResponseInterface => {
  return {
    statusCode: statusCode,
    message: message,
    error: error,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
  };
};
