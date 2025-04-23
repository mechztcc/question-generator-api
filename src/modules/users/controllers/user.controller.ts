import { Request, Response } from 'express';
import { AutenticateUsersService } from '../services/autenticate/autenticate-users.service';
import { CreateUsersService } from '../services/create-users/create-users.service';

export class UsersController {
  async create(req: Request, res: Response): Promise<void> {
    const createUserService = new CreateUsersService();

    const { name, email, password } = req.body;

    const user = await createUserService.execute({ name, email, password });

    res.json(user);
  }

  async update() {}

  async autenticate(req: Request, res: Response): Promise<void> {
    const createUserSession = new AutenticateUsersService();
    const { email, password } = req.body;

    const session = await createUserSession.execute({ email, password });
    res.json(session);
  }
}
