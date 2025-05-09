import Together from 'together-ai';
import { PrismaClient } from '../../../../generated/prisma';

interface IPayload {
  question: string;
  value: string;
  context: string;
}

export class VerifyAnswerService {
  private _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  async execute({ question, value, context }: IPayload) {
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });

    const response = await together.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `
            Com base nesse contexto: ${context}, verifique se essa resposta:  ${value} esta correta.
            retorne um objeto com isCorrect: boolean, context: com a justificativa da correção
          `,
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

    return JSON.parse(summaryRaw);
  }
}
