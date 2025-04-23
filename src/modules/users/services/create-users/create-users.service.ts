import { hash } from 'bcryptjs';
import { PrismaClient } from '../../../../generated/prisma';
import GlobalErrors from '../../../../shared/errors/global-error';

interface IPayload {
  name: string;
  email: string;
  password: string;
}
export class CreateUsersService {
  private _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  async create({ name, email, password }: IPayload) {
    const emailExists = await this._prisma.user.findUnique({ where: { email } });
    if(emailExists) {
        throw new GlobalErrors('E-mail already in use')
    }

    const hashedPass = await hash(password, 8);

    const user = await this._prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
      },
    });

    return user;
  }
}
