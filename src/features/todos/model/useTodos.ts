import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as todosApi from '../api/todosApi';

const TODOS_KEY = ['todos'];

export function useTodosQuery() {
  return useQuery({
    queryKey: TODOS_KEY,
    queryFn: todosApi.getTodos,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: todosApi.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof todosApi.updateTodo>[1] }) =>
      todosApi.updateTodo(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: todosApi.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}
