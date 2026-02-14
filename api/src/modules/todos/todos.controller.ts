import { Request, Response, NextFunction } from 'express';
import * as todosService from './todos.service.js';
import {
  createTodoSchema,
  updateTodoSchema,
  todoIdSchema,
} from './todos.schemas.js';

export async function getTodos(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const todos = await todosService.getAllTodos();
    res.json(todos);
  } catch (error) {
    next(error);
  }
}

export async function createTodo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = createTodoSchema.parse(req.body);
    const todo = await todosService.createTodo(input);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

export async function updateTodo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = todoIdSchema.parse(req.params.id);
    const input = updateTodoSchema.parse(req.body);
    const todo = await todosService.updateTodo(id, input);

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    next(error);
  }
}

export async function deleteTodo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = todoIdSchema.parse(req.params.id);
    const deleted = await todosService.deleteTodo(id);

    if (!deleted) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
