import { Request, Response } from 'express';
import { CreateUsersService } from '../services/create-users/create-users.service';

export class UsersController {
  async create(req: Request, res: Response): Promise<any> {
    const createUserService = new CreateUsersService();

    const { name, email, password } = req.body;

    const user = await createUserService.create({ name, email, password });

    res.json(user);
  }

  async update() {}
}
