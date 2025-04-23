import { errors } from 'celebrate';
import 'dotenv/config';
import express from 'express';
import { errorMiddleware } from '../middlewares/error';
import routes from './routes';

const app = express();
app.use(express.json());
app.use(routes);
app.use(errors());

// app.get('/', async (req, res) => {
//   const together = new Together({
//     apiKey: process.env.TOGETHER_API_KEY,
//   });

//   const response = await together.chat.completions.create({
//     messages: [
//       { role: 'user', content: 'What are some fun things to do in New York?' },
//     ],
//     model: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
//   });

//   res.send(response.choices[0].message);
// });

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

app.use(errorMiddleware);
