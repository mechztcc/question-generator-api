import { NextFunction, Request, Response } from 'express';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {

  let message = err.message || 'Erro interno do servidor.';

  if (err.details) {
    message = err.details.get('body').details[0].message;
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
}
