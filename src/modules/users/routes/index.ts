import { Router, Request, Response } from 'express';
import { UsersController } from '../controllers/user.controller';
import { celebrate, Joi, Segments } from 'celebrate';
import { asyncHandler } from '../../../shared/middlewares/async-handler';

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(3).required().messages({
        'string.empty': 'O nome não pode estar vazio.',
        'string.min': 'O nome deve ter pelo menos 3 caracteres.',
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'Email inválido.',
        'string.empty': 'O email não pode estar vazio.',
      }),
      password: Joi.string().min(6).required().messages({
        'string.empty': 'A senha não pode estar vazio.',
        'string.min': 'A senha deve ter pelo menos 6 caracteres.',
      }),
    }),
  }),
  asyncHandler((req: Request, res: Response) =>
    usersController.create(req, res),
  ),
);

export default usersRouter;
