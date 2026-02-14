import express from 'express';
import cors from 'cors';
import { todosRouter } from './modules/todos/todos.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/todos', todosRouter);

app.use(errorHandler);
