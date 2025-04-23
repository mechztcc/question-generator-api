import { Router } from 'express';
import { UsersController } from '../controllers/user.controller';

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.get('/', usersController.create);


export default usersRouter;