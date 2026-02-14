import { Router } from 'express';
import * as todosController from './todos.controller.js';

export const todosRouter = Router();

todosRouter.get('/', todosController.getTodos);
todosRouter.post('/', todosController.createTodo);
todosRouter.patch('/:id', todosController.updateTodo);
todosRouter.delete('/:id', todosController.deleteTodo);
