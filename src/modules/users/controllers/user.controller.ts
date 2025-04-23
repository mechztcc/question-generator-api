import { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma';

import { hash } from 'bcryptjs';

export class UsersController {
  private _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  async create(req: Request, res: Response): Promise<any> {
    const { name, email, password } = req.body;

    const hashedPass = await hash(password, 8);

    const user = await this._prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
      },
    });

    res.json(user);
  }

  async update() {}
}
