import GlobalErrors from '../../../../shared/errors/global-error';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { PrismaClient } from '../../../../generated/prisma';

interface IPayload {
  email: string;
  password: string;
}

export class AutenticateUsersService {
  private _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  async execute({ email, password }: IPayload) {
    const userExists = await this._prisma.user.findUnique({ where: { email } });
    if (!userExists) {
      throw new GlobalErrors('Invalid credentials');
    }

    const match = await compare(password, userExists.password);
    if (!match) {
      throw new GlobalErrors('Invalid credentials');
    }

    const token = sign({}, 'secret', { expiresIn: '1d' });

    return {
      email: userExists.email,
      name: userExists.name,
      token,
    };
  }
}
