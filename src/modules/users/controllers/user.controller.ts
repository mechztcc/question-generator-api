import { Request, Response } from 'express';
import { AutenticateUsersService } from '../services/autenticate/autenticate-users.service';
import { CreateUsersService } from '../services/create-users/create-users.service';
import Together from 'together-ai';
import { log } from 'console';

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
    const createUserSession = new AutenticateUsersService();
    const { title, level, answers } = req.body;

    
    res.json({ title, level, answers  });
  }

  async sendContent(req: Request, res: Response): Promise<void> {
    const { content } = req.body;
    
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });

    const response = await together.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `
          Gere 3 questões, com 4 alternativas cada sobre o conteudo a seguir:\n\n${content}.
          Monte a resposta contendo um array de objetos questões, com title: onde será o titulo da pergunta, level: com a dificuldade, que pode ser fácil, normal ou difícil e answers: um array de objetos 
          com value: a alternativa, e correct: bollean, true ou false.
          Retorne apenas o array de objetos
          `,
        },
      ],
      model: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
    });

    let summaryRaw = response.choices?.[0]?.message?.content ?? '[]'

    summaryRaw = summaryRaw.replace(/```[\s\S]*?```/, match => {
      return match.replace(/```(json|javascript)?/, '').replace(/```/, '').trim()
    })

    let summaryParsed = JSON.parse(summaryRaw)

    res.send({ questions: summaryParsed });
  }
}
