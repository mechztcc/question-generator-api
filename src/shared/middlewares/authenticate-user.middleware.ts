import { NextFunction, Request, Response } from 'express';
import GlobalErrors from '../errors/global-error';

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.headers.authorization;

  if (!token) {
    throw new GlobalErrors('User credentials has not provided', 401);
  }

  console.log('Token recebido:', token);
  next();
}
