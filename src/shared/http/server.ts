import 'dotenv/config';

import { errors } from 'celebrate';
import express from 'express';
import { errorMiddleware } from '../middlewares/error';
import routes from './routes';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());


app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

app.use(errorMiddleware);
