import { Level, PrismaClient } from '../../../../generated/prisma';
import GlobalErrors from '../../../../shared/errors/global-error';

interface IPayload {
  title: string;
  level: Level;
  answers: { correct: boolean; value: string }[];
  userId: number;
}

export class SaveQuestionService {
  private _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  async execute({ title, level, answers, userId: id }: IPayload) {
    const userExists = await this._prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      throw new GlobalErrors('User not found.', 401);
    }

    const quest = await this._prisma.question.create({
      data: {
        title,
        level,
        userId: userExists.id,
        answers: {
          create: answers.map((el) => {
            return {
              correct: el.correct,
              value: el.value,
            };
          }),
        },
      },
    });

    return quest;
  }
}
