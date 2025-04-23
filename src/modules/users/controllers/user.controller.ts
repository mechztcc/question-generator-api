import { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma';
import GlobalErrors from '../../../shared/errors/global-error';

export class UsersController {
  async create(req: Request, res: Response): Promise<any> {
    // const { name, email, role } = req.body;
    const prisma = new PrismaClient();


    res.json({ sucesso: false })
  }

  async update() {}
}
