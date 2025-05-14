import { Request, Response } from 'express';
import { AutenticateUsersService } from '../services/autenticate/autenticate-users.service';
import { CreateUsersService } from '../services/create-users/create-users.service';
import Together from 'together-ai';
import { log } from 'console';
import { SaveQuestionService } from '../services/save-question/save-question.service';
import GlobalErrors from '../../../shared/errors/global-error';
import { ListSavedQuestionsByUserService } from '../services/list-saved-questions-by-user/list-saved-questions-by-user.service';
import { VerifyAnswerService } from '../services/verify-answer/verify-answer.service';

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

  async saveQuestion(req: Request, res: Response): Promise<void> {
    const createQuestion = new SaveQuestionService();
    const { title, level, answers, type, context = '' } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new GlobalErrors('User credentials has not provided.', 401);
    }

    const quest = await createQuestion.execute({
      title,
      level,
      type,
      context,
      answers,
      userId,
    });
    res.json(quest);
  }

  async listQuestionsByUser(req: Request, res: Response) {
    const listQuestionsService = new ListSavedQuestionsByUserService();
    const userId = Number(req.user?.id);

    const questions = await listQuestionsService.execute({ userId: userId });

    res.json(questions);
  }

  async onVerifyAnswer(req: Request, res: Response) {
    const verifyAnswerService = new VerifyAnswerService();
    const { question, value, context } = req.body;

    const result = await verifyAnswerService.execute({ question, value, context });

    res.json(result)
  }

  async sendContent(req: Request, res: Response): Promise<void> {
    const { content, alternatives, questionsCount, type } = req.body;

    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });

    let message = '';

    if (type == 'closed') {
      message = `
          Gere ${questionsCount} questões, com ${alternatives} alternativas cada sobre o conteudo a seguir:\n\n${content}.
          Monte a resposta contendo um array de objetos questões, com title: onde será o titulo da pergunta, level: com a dificuldade, 
          que pode ser fácil, normal ou difícil e answers: um array de objetos 
          com value: a alternativa, e correct: bollean, true ou false, 
          um campo type que deve ser string com o valor 'closed'
          Retorne apenas o array de objetos
          `;
    }

    if (type == 'opened') {
      message = `
          Gere ${questionsCount} questões, sobre o conteudo a seguir:\n\n${content}.
          Monte a resposta contendo um array de objetos questões, com title: onde será o titulo da pergunta, 
          context que justifique a alternativa correta,
          level: com a dificuldade, 
          que pode ser fácil, normal ou difícil e answers: um array de objetos 
          com value: o tema central do que deve ser a resposta, e correct: bollean, que deve sempre ser true, 
          um campo type que deve ser string com o valor 'opened',
          Retorne apenas o array de objetos
          `;
    }

    const response = await together.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
    });

    let summaryRaw = response.choices?.[0]?.message?.content ?? '[]';

    summaryRaw = summaryRaw.replace(/```[\s\S]*?```/, (match) => {
      return match
        .replace(/```(json|javascript)?/, '')
        .replace(/```/, '')
        .trim();
    });

    let summaryParsed = JSON.parse(summaryRaw);

    res.send({ questions: summaryParsed });
  }
}
