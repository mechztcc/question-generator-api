import { celebrate, Joi, Segments } from 'celebrate';
import { Request, Response, Router } from 'express';
import { asyncHandler } from '../../../shared/middlewares/async-handler';
import { UsersController } from '../controllers/user.controller';
import { authenticateUser } from '../../../shared/middlewares/authenticate-user.middleware';

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

usersRouter.post(
  '/create-session',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
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
    usersController.autenticate(req, res),
  ),
);

usersRouter.post(
  '/upload-file',
  asyncHandler((req: Request, res: Response) =>
    usersController.sendContent(req, res),
  ),
);

usersRouter.post(
  '/save-question',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required().messages({
        'string.empty': 'Title não pode estar vazio.',
      }),
      level: Joi.string().required().messages({
        'string.empty': 'Level não pode estar vazio.',
      }),
      type: Joi.string().required().messages({
        'string.empty': 'Tipo não pode estar vazio.',
      }),
      answers: Joi.array().required().messages({
        'string.empty': 'Answers não pode estar vazio.',
      }),
    }),
  }),
  authenticateUser,
  asyncHandler((req: Request, res: Response) =>
    usersController.saveQuestion(req, res),
  ),
);

usersRouter.get(
  '/list-questions',
  authenticateUser,
  asyncHandler((req: Request, res: Response) =>
    usersController.listQuestionsByUser(req, res),
  ),
);

usersRouter.post(
  '/verify-response',
  authenticateUser,
  asyncHandler((req: Request, res: Response) =>
    usersController.onVerifyAnswer(req, res),
  ),
);

export default usersRouter;
