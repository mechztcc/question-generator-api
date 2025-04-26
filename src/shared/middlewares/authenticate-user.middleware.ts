import { NextFunction, Request, Response } from 'express';
import GlobalErrors from '../errors/global-error';
import { verify } from 'jsonwebtoken';


interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.headers.authorization;
  console.log('decodedToken', token);


  if (!token) {
    throw new GlobalErrors('User credentials has not provided', 401);
  }

  try {
    const decodedToken = verify(token, 'secret') as JwtPayload;
    console.log('decodedToken', decodedToken);

    if (!decodedToken.id) {
      throw new GlobalErrors('Token malformado', 401);
    }

    req.user = { id: Number(decodedToken.id) };
    next();
  } catch (error) {
    console.log(error);
    
    throw new GlobalErrors('Invalid token', 401);
  }
}