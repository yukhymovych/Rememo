import * as todosSQL from './todos.sql.js';
import { CreateTodoInput, UpdateTodoInput } from './todos.schemas.js';

export async function getAllTodos() {
  return todosSQL.getAllTodos();
}

export async function createTodo(input: CreateTodoInput) {
  return todosSQL.createTodo(input.title);
}

export async function updateTodo(id: string, input: UpdateTodoInput) {
  return todosSQL.updateTodo(id, input);
}

export async function deleteTodo(id: string) {
  return todosSQL.deleteTodo(id);
}
