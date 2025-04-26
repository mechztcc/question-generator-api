import { PrismaClient, Question } from '../../../../generated/prisma';
import GlobalErrors from '../../../../shared/errors/global-error';

interface IPayload {
  userId: number;
}

export class ListSavedQuestionsByUserService {
  private _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  async execute({ userId: id }: IPayload): Promise<Question[]> {
    const userExists = await this._prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      throw new GlobalErrors('User not found.', 401);
    }

    const questions = await this._prisma.question.findMany({
      include: { answers: true },
      where: { user: { id } },
    });

    return questions;
  }
}
